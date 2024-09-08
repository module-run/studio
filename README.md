# ModuleRun Studio


## install

> Please use nodejs 20

```
nvm use 20
npm install
npm run dev
```

## project

工程目录结构

```
/工程目录
    /site-packages          # 系统依赖包
        /pip1
        /pip2
    /module                 # 模块
        /moduleA
            /monitor.py
        /moduleB
            /xxx.py
    /plugin                 # 插件
        /pluginA
            /xxx.py
    /main.py
    /main.visual.json
    /config.json
```

```
pyinstaller -F main.py > xxx.bin
```

默认工程下会有一个 `config.json` 配置文件，文件结构如下

```python
# install all
pip install -r requirements.txt --target=<项目根目录>
# install one
pip install package_name --target=<项目根目录>
```

```python
module.moduleA.monitor.setSpeed(100)
plugin.pluginA.xxx.xxx()
```

sqlite 结构

```sql
## project
CREATE TABLE project
(
    id       INTEGER PRIMARY KEY,
    createAt DATETIME,
    updateAt DATETIME,
    version  INTEGER,
    name     VARCHAR(200),
    type     VARCHAR(50),
    config   TEXT
);
## file
CREATE TABLE file
(
    id        INTEGER PRIMARY KEY,
    createAt  DATETIME,
    updateAt  DATETIME,
    version   INTEGER,
    projectId INTEGER,
    name      VARCHAR(200),
    content   TEXT,
);
```



## TODO

- [ ] Blockly 代码集成
- [x] 首页界面
- [x] 设置界面
- [x] 顶部菜单栏自定义
- [ ] 代码编辑器集成
- [ ] 工程界面布局调整
- [ ] 通讯协议设计
- [ ] SQLit 数据库操作
