# Hilton Test (Sample Reservation System)
## 功能介绍
一个简单的预订系统，可以用guest或者employee登录，guest根据选择日历来查看已预订的日程（查看自己所有的和所选日期所有的预订），也可新增修改（状态为来宾预订或取消）预订，employee可以查看所有guest预订（查看所有来宾和所选日期所有的预订），并修改（状态为餐厅确认或取消）预订，简化了部分逻辑，如分页等  
![image](https://github.com/hjj28810/HiltonTest/blob/main/assets/show3.png) 
![image](https://github.com/hjj28810/HiltonTest/blob/main/assets/show1.png) 
![image](https://github.com/hjj28810/HiltonTest/blob/main/assets/show2.png) 
![image](https://github.com/hjj28810/HiltonTest/blob/main/assets/show4.png)  
环境要求: nodejs 14  
运行 -- npm install (如有报错，因为墙的关系，多试几次即可)  
client  运行cmd -- npm run serve -- host: http://localhost:8080  
server  运行cmd -- nodemon src/app.js -- host: http://localhost:8081  
couchbase host: http://localhost:8091 username: Administrator password: 888666（可在配置文件里更改）  
----------***`初始化三个bucket: guest reservation checkSum`***  
## 技术选型
我本身并不是nodejs和纯前端开发，项目中要求的必要技术，大多是我第一次听说或使用，所以在满足所有必要的选项后，基于时间上的考虑，bouns的我就选了couchbase和docker，和其他一些我觉得好用方便的技术在里面，开发前，第一次接触的技术，我会先google，评估该技术的上手难易程度，等对所有技术看过一遍后，才开始编码，把相对方便容易的先写，整体逻辑框架先搭建完成，基本需求逻辑跑通，再加上其他的代码和功能，都是自己多次测试和验证的  
***`Express（nodejs web框架，容易上手，成熟度高，例子多）`***  
***`Log4js（著名的日志框架，我.net和golang开发也用的log4net和log4go）`***  
***`GraphQL.js（GraphQL原生库，使用方便）`***  
***`Supertest（nodejs unit-test库，成熟高，例子多）`***  
***`ElementUI（前端vue框架，方便好用）`***  
***`Couchbase（必选项要求nosql，本来想用redis，后来看了下，这个也蛮方便的，正好学一下如何使用）`***  
***`Docker（现在大多数项目都部署docker，我本身公司项目也是部署docker和阿里云k8s）`***  
***`JWT（常规鉴权）`***  
## 项目结构
--hiltontest  
----server（服务端代码）  
------src  
--------config（配置文件）  
--------router（controller层）  
--------schema（graphQL schema）  
--------service（业务逻辑处理层）  
--------storage（数据存储层）  
--------test（单元测试）  
--------util（工具类）  
----client（客户端代码）  
------src  
--------api（request请求层）  
--------assets（静态资产）  
--------router（vue router管理）  
--------utils（工具类）  
--------views（view层）  
如此项目结构分层，是因为多年来的开发经验，以及合理的分层在重构和复用上有的巨大的好处，而且对有ioc框架的语言来说，更是方便不少  
介于时间问题，很多想法和技术没有实现，不过不影响功能
