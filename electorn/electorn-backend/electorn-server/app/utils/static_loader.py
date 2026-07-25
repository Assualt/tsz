import os
import json
from app.core.logging_config import console


class StaticLoader:
    def __init__(self, static_dir: str = "data/static"):
        self.static_dir = static_dir
        self.cache = {}
        self.load()
    
    def load(self):
        """加载所有静态资源到内存中"""
        if not os.path.exists(self.static_dir):
            console.warning(f"Static directory {self.static_dir} does not exist")
            return
        
        files = os.listdir(self.static_dir)
        for file in files:
            file_path = os.path.join(self.static_dir, file)
            if os.path.isfile(file_path):
                try:
                    file_name = os.path.splitext(file)[0]
                    if file.endswith('.json'):
                        with open(file_path, 'r', encoding='utf-8') as f:
                            self.cache[file_name] = json.load(f)
                        console.info(f"Loaded JSON static file: {file}")
                    elif file.endswith('.md'):
                        with open(file_path, 'r', encoding='utf-8') as f:
                            self.cache[file_name] = f.read()
                        console.info(f"Loaded MD static file: {file}")
                    else:
                        console.warning(f"Unsupported file type: {file}")
                except Exception as e:
                    console.error(f"Failed to load static file {file}: {str(e)}")
        
        console.info(f"Successfully loaded {len(self.cache)} static files")
    
    def get(self, key: str):
        """获取静态资源"""
        return self.cache.get(key)
    
    def reload(self):
        """重新加载所有静态资源"""
        self.cache.clear()
        self.load()


# 创建静态资源加载器实例
static_loader = StaticLoader()
