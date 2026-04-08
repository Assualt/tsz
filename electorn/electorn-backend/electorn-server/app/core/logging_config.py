import logging
import logging.config
import json
from datetime import datetime
import os
import configparser

# 确保 logs 目录存在
os.makedirs("logs", exist_ok=True)

# 创建 JSON 格式的日志 formatter
class JSONFormatter(logging.Formatter):
    def format(self, record):
        log_record = {
            "timestamp": datetime.utcnow().isoformat(),
            "level": record.levelname,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName,
            "line": record.lineno
        }
        if hasattr(record, "extra_data"):
            log_record.update(record.extra_data)
        return json.dumps(log_record)

# 加载日志配置
def load_logging_config():
    # 读取 ini 文件内容
    with open("conf/logging.ini", "r") as f:
        config_content = f.read()
    
    # 处理日期占位符
    date_str = datetime.now().strftime("%Y-%m-%d")
    config_content = config_content.replace("%(date)s", date_str)
    
    # 写回临时文件
    temp_config = "conf/logging_temp.ini"
    with open(temp_config, "w") as f:
        f.write(config_content)
    
    # 加载配置
    logging.config.fileConfig(temp_config)
    
    # 删除临时文件
    os.remove(temp_config)


# 初始化日志
load_logging_config()

# 获取 logger
trans = logging.getLogger("electorn.file")
console = logging.getLogger("electorn.console")

# 只为 trans 添加 JSONFormatter
formatter = JSONFormatter()
for handler in trans.handlers:
    handler.setFormatter(formatter)


