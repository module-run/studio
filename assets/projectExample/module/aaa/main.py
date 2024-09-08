# 每个块生成一个函数，函数名按顺序生成
# 运行时，每个函数启动一个线程

import extend.sonar.sonar_setting as sonar_setting

def block_1:
    # 生成的代码
    # aaa = 1
    mr.setVar('aaa', 1)
    sonar_setting(1,2)
    pass

def block_2:
    # 生成的代码
    pass

def block_3:
    # 生成的代码
    pass
