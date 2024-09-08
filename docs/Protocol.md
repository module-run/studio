# Studio 和 Agent 通讯协议

## 协议介绍

采用 `websocket` 作为基础协议，实现 `studio` 和 `agent` 之间的通讯。

`agent`（树莓派）是 `server` 端，`studio` 是 `client` 端。

## 通讯协议定义

采用 JSON 的格式，基础协议如下

### 通用请求数据包

`studio <-> agent`

```json5
{
    // ID，唯一，随机生成，幂等处理
    "id": "<id>",
    // 类型
    "type": "<type>",
    // 业务数据
    "data": {
        "xxx": "xxx"
    }
}
```

### 通用响应数据包

`studio <-> agent`

```json5
{
    // ID，唯一，随机生成，幂等处理
    "id": "<id>",
    // 响应信息
    "response": {
        // 响应关联 ID，对应 request 的 ID，用于关联响应数据
        "id": "<id>",
        // 响应码，0 成功，非 0 失败
        "code": 0,
        // 响应消息，失败时返回错误信息
        "msg": "ok",
    },
    // 业务数据
    "data": {
        "xxx": "xxx"
    }
}
```

## 协议指令

### 心跳 `ping`

`studio -> agent`

```json5
{
    "id": "<id>",
    "type": "ping",
    "data": {}
}
```

`agent -> studio`

```json5
{
    "id": "<id>",
    "response": {
        "id": "<id>",
        "code": 0,
        "msg": "ok"
    },
    "data": {}
}
```

### 配置 `config`

`studio -> agent`

```json5
{
    "id": "<id>",
    "type": "config",
    "data": {}
}
```

`agent -> studio`

```json5
{
    "id": "<id>",
    "response": {
        "id": "<id>",
        "code": 0,
        "msg": "ok"
    },
    "data": {
        // 设备类型，RaspberryPI 树莓派 Emulator 模拟器
        "type": "RaspberryPI",
        // 软件版本
        "agentVersion": "0.0.1",
        // 树莓派名称
        "name": "xxx",
        // 树莓派序列号
        "sn": "xxx",
        // 时间
        "time": "2021-01-01 00:00:00",
        // 网络信息
        "addr": "192.168.1.1",
        "port": 8080,
        "mac": "xx:xx:xx:xx:xx:xx"
    }
}
```

### 全局通知 `notice`

任何时候都可以发送通知，比如设备状态变更，项目状态变更等，`studio` 会以通知的方式显示给用户。

`agent -> studio`

```json5
{
    "id": "<id>",
    "type": "notice",
    "data": {
        // 通知类型 info, warn, error
        "type": "info",
        // 通知内容
        "msg": "xxx"
    }
}
```

### 创建项目 `project.create`

`studio -> agent`

```json5
{
    "id": "<id>",
    "type": "project.create",
    "data": {
        // 项目ID，字母开头唯一
        "id": "xxx"
    }
}
```

`agent -> studio`

```json5
{
    "id": "<id>",
    "response": {
        "id": "<id>",
        "code": 0,
        "msg": "ok"
    },
    "data": {}
}
```

### 删除项目 `project.delete`

`studio -> agent`

```json5
{
    "id": "<id>",
    "type": "project.delete",
    "data": {
        // 项目ID，字母开头唯一
        "id": "xxx"
    }
}
```

`agent -> studio`

```json5
{
    "id": "<id>",
    "response": {
        "id": "<id>",
        "code": 0,
        "msg": "ok"
    },
    "data": {}
}
```

### 运行项目 `project.run`

`studio -> agent`

```json5
{
    "id": "<id>",
    "type": "project.run",
    "data": {
        // 项目ID，字母开头唯一
        "id": "xxx"
    }
}
```

`agent -> studio`

```json5
{
    "id": "<id>",
    "response": {
        "id": "<id>",
        "code": 0,
        "msg": "ok"
    },
    "data": {}
}
```

### 项目停止 `project.stop`

`studio -> agent`

```json5
{
    "id": "<id>",
    "type": "project.stop",
    "data": {
        // 项目ID，字母开头唯一
        "id": "xxx"
    }
}
```

### 项目状态 `project.status`

`studio -> agent`

```json5
{
    "id": "<id>",
    "type": "project.status",
    "data": {
        // 项目ID，字母开头唯一
        "id": "xxx"
    }
}
```

`agent -> studio`

```json5
{
    "id": "<id>",
    "response": {
        "id": "<id>",
        "code": 0,
        "msg": "ok"
    },
    "data": {
        // 项目ID，字母开头唯一
        "id": "xxx",
        // 项目状态，running, stopped
        "status": "running"
    }
}
```

`agent -> studio` 主动推送

```json5
{
    "id": "<id>",
    "type": "project.status",
    "data": {
        // 项目ID，字母开头唯一
        "id": "xxx",
        // 项目状态，running, stopped
        "status": "running"
    }
}
```

### 项目日志 `project.log`

`agent -> studio`

```json5
{
    "id": "<id>",
    "type": "project.log",
    "data": {
        // 项目ID，字母开头唯一
        "id": "xxx",
        // 日志级别，info, warn, error
        "level": "info",
        // 日志内容
        "log": "xxx"
    }
}
```

`agent -> studio`

```json5
{
    "id": "<id>",
    "response": {
        "id": "<id>",
        "code": 0,
        "msg": "ok"
    },
    "data": {}
}
```

### 同步文件 `project.fileWrite`

`studio -> agent`

```json5
{
    "id": "<id>",
    "type": "project.fileWrite",
    "data": {
        // 项目ID，字母开头唯一
        "id": "xxx",
        "files": [
            {
                // 相对于项目根路径的文件路径
                "path": "xxx",
                // 文件内容，base64 编码
                "content": "xxx=="
            },
            {
                // 相对于项目根路径的文件路径
                "path": "xxx",
                // 文件内容，base64 编码
                "content": "xxx=="
            }
        ]
    }
}
```

`agent -> studio`

```json5
{
    "id": "<id>",
    "response": {
        "id": "<id>",
        "code": 0,
        "msg": "ok"
    },
    "data": {}
}
```

### 安装全部 pip 依赖 `project.pipInstall`

`studio -> agent`

```json5
{
    "id": "<id>",
    "type": "project.pipInstall",
    "data": {
        // 项目ID，字母开头唯一
        "id": "xxx",
        "packages": {
            //xxx包名称，x.y.z版本可以为空，为空则安装最新版本
            "xxx": "x.y.z",
            "xxx": "x.y.z"
        }
    }
}
```

`agent -> studio`

```json5
{
    "id": "<id>",
    "response": {
        "id": "<id>",
        "code": 0,
        "msg": "ok"
    },
    "data": {}
}
```

### 删除 pip 依赖 `project.pipUninstall`

`studio -> agent`

```json5
{
    "id": "<id>",
    "type": "project.pipUninstall",
    "data": {
        // 项目ID，字母开头唯一
        "id": "xxx",
        // pip 包名
        "packages": {
            //xxx包名称，x.y.z不用填写
            "xxx": "",
            "xxx": ""
        }
    }
}
```

`agent -> studio`

```json5
{
    "id": "<id>",
    "response": {
        "id": "<id>",
        "code": 0,
        "msg": "ok"
    },
    "data": {}
}
```
