"""AI 助手服务层。

职责：
- 维护 AI 助手的固定身份常量（会话类型、发送者信息、欢迎语）；
- 调用 .env 中配置的 OpenAI 兼容大模型（AI_API_KEY / AI_BASE_URL / AI_MODEL 等）；
- 未配置模型或调用失败时，回退内置规则回复，保证聊天链路始终可用。

接口层（app/api/.../chat.py）只负责会话/消息的数据库读写，
所有 AI 相关逻辑统一收敛在本模块。
"""
import json
import time
import urllib.error
import urllib.request

from app.core.config import settings
from app.core.logging_config import console, trans


# AI 助手固定身份（sender_id=0 为系统保留ID，不与真实用户冲突）
AI_CONVERSATION_TYPE = "ai"
AI_SENDER_ID = 0
AI_SENDER_NAME = "AI助手"
AI_AVATAR = "https://api.dicebear.com/7.x/bottts/svg?seed=ai-assistant&size=64"
AI_WELCOME = "你好，我是你的AI助手～可以问我车票查询、出行建议，或者随便聊聊！"
# 规则回退模式下的模拟"思考"耗时；真实模型调用本身有网络耗时，不再额外等待
AI_REPLY_DELAY_SECONDS = 0.8

# 模型系统提示词：约束 AI 助手的人设与回答边界
AI_SYSTEM_PROMPT = (
    "你是12306助手应用内的AI助手，名叫AI助手。"
    "请用简洁、友好的中文回答用户问题，擅长火车票查询、购票、退票改签、出行规划类问题，"
    "也可以日常闲聊。回答控制在200字以内，不要编造不存在的车次实时数据。"
)


def is_model_configured() -> bool:
    """是否已在 .env 中配置可用的模型 API Key。"""
    return bool((settings.AI_API_KEY or "").strip())


def _rule_based_reply(user_content: str) -> str:
    """内置轻量规则回复：未配置模型或模型调用失败时的兜底链路。"""
    if any(k in user_content for k in ("你好", "您好", "hi", "hello", "在吗", "在么")):
        return "你好呀！我是AI助手，很高兴为你服务～需要查车票、了解出行信息，还是随便聊聊？"
    if any(k in user_content for k in ("谢谢", "感谢", "辛苦", "thanks", "thank")):
        return "不客气，能帮到你就好！还有其他问题随时找我～"
    if any(k in user_content for k in ("再见", "拜拜", "拜", "bye")):
        return "再见！祝你旅途顺利，需要时随时回来找我～"
    if any(k in user_content for k in ("车票", "火车票", "高铁", "动车", "余票", "几点", "车次")):
        return ("关于车票，我可以这样帮你：\n"
                "1. 在「车票」页输入出发地、目的地和日期查询余票；\n"
                "2. 告诉我具体的出发城市、到达城市和日期，我可以帮你梳理出行建议。\n"
                "例如：周五从北京去上海有哪些车？")
    if any(k in user_content for k in ("退", "改签", "退票")):
        return "退票或改签可在「订单」页找到对应订单操作。开车前8天以上退票免手续费，越临近发车手续费越高哦。"
    if any(k in user_content for k in ("你是谁", "你叫什么", "能做什么", "功能")):
        return "我是12306助手里的AI助手，可以解答购票、退票改签、出行规划类问题，也支持日常闲聊～"
    if any(k in user_content for k in ("天气", "穿什么")):
        return "出行前建议关注目的地天气，带好相应衣物和雨具；高铁上空调较足，可以备一件薄外套。"

    # 兜底回复（含简单回声，让对话不中断）
    return f"我收到你的消息啦：「{user_content[:50]}」。目前我比较擅长车票与出行类问题，换个问法试试看？"


def _format_model_error(exc: Exception) -> str:
    """提取模型调用异常的关键诊断信息。

    HTTPError 的供应商错误说明（如 invalid_api_key / model_not_found）在响应体中，
    str(exc) 只能拿到 "HTTP Error 401: Unauthorized"，因此这里额外读取 body。
    """
    if isinstance(exc, urllib.error.HTTPError):
        body = ""
        try:
            body = exc.read().decode("utf-8", errors="replace").strip()
        except Exception:  # noqa: BLE001 - 读取失败时退化为仅状态码信息
            pass
        return f"HTTP {exc.code} {exc.reason} | url={exc.url} | body={body[:500]}"
    return f"{type(exc).__name__}: {exc}"


def _call_ai_model(user_content: str):
    """调用 OpenAI 兼容的 Chat Completions 接口。

    配置全部来自 .env（经 settings 加载）：AI_API_KEY / AI_BASE_URL / AI_MODEL /
    AI_TEMPERATURE / AI_MAX_TOKENS / AI_TIMEOUT。
    使用标准库 urllib，无需新增第三方依赖。

    :return: 模型回复文本；未配置 API Key 或调用失败时返回 None（由上层回退规则回复）
    """
    if not is_model_configured():
        return None

    console.info(f"post AI reply for: {user_content}")
    url = settings.AI_BASE_URL.rstrip("/") + "/chat/completions"
    payload = json.dumps({
        "model": settings.AI_MODEL,
        "messages": [
            {"role": "system", "content": AI_SYSTEM_PROMPT},
            {"role": "user", "content": user_content}
        ],
        "temperature": settings.AI_TEMPERATURE,
        "max_tokens": settings.AI_MAX_TOKENS
    }).encode("utf-8")

    request = urllib.request.Request(
        url,
        data=payload,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {settings.AI_API_KEY.strip()}"
        },
        method="POST"
    )

    try:
        with urllib.request.urlopen(request, timeout=settings.AI_TIMEOUT) as response:
            result = json.loads(response.read().decode("utf-8"))
            console.info(f"AI model call success, response: {result}")
        reply = result["choices"][0]["message"]["content"].strip()
        return reply or None
    except (urllib.error.URLError, urllib.error.HTTPError, KeyError, IndexError,
            json.JSONDecodeError, TimeoutError) as exc:
        # 模型不可用时不影响聊天主链路，记录日志后回退规则回复。
        # 注意：console logger 的格式不含 extra_data，诊断信息必须直接写进 message；
        # trans（JSON 文件日志）再以 extra_data 结构化记录一份。
        error_detail = _format_model_error(exc)
        console.warning(
            "AI model call failed, fallback to rule reply | model=%s | error=%s",
            settings.AI_MODEL, error_detail
        )
    except Exception as exc:
        console.error("AI model call failed, fallback to rule reply",
                        extra={"extra_data": {"model": settings.AI_MODEL, "error": str(exc)}})
        return None


def generate_ai_reply(user_content: str) -> str:
    """生成 AI 回复：优先调用 .env 配置的大模型，未配置/失败时回退内置规则。"""
    model_reply = _call_ai_model(user_content)
    if model_reply:
        return model_reply
    return _rule_based_reply(user_content)


def maybe_simulate_typing_delay() -> None:
    """规则回退模式下短暂等待模拟"思考中"；已配置真实模型时无需额外延迟。"""
    if not is_model_configured():
        time.sleep(AI_REPLY_DELAY_SECONDS)
