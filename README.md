# Hilton Test (Sample Reservation System)
## 功能介绍
一个简单的预订系统，可以用guest或者employee登录，guest根据选择日历来查看已预订的日程（查看自己所有的和所选日期的预订，可根据时间状态筛选），也可新增修改（状态为来宾预订或取消）预订，employee可以查看所有guest预订（查看所有来宾和所选日期的预订，可根据时间状态筛选），并修改（状态为餐厅确认或取消）预订   
![image](https://github.com/hjj28810/HiltonTest/blob/main/assets/show3.png) 
![image](https://github.com/hjj28810/HiltonTest/blob/main/assets/show1.png) 
![image](https://github.com/hjj28810/HiltonTest/blob/main/assets/show2.png) 
![image](https://github.com/hjj28810/HiltonTest/blob/main/assets/show4.png)  
环境要求: nodejs 14+  
运行 -- npm install (如有报错，因为墙的关系，多试几次即可)  
client  运行cmd```npm run serve```host: http://localhost:8080  
server  运行cmd```nodemon src/app.js```host: http://localhost:8081 unit-test```npm test src/test/app.test.js```  
couchbase capella（不知道是不是试用版的原因，偶尔报code=995的错误，错误内容还是乱码，用local的就不会有，如碰到验签失败或接口错误请多试几次）  
----host: couchbases://cb.4okihh3fqkurvdmu.cloud.couchbase.com  
----username: admin  
----password: Password@1  
***`如使用local couchbase，则初始化三个bucket: guest reservation checkSum 并创建index以便启用N1Ql`***  
![image](https://github.com/hjj28810/HiltonTest/blob/main/assets/show6.png)  
## 部署
client cd ../hiltontest/client  
```npm run build```  
```docker build -t hilton-client:1.0 .```  
```docker run --name hilton-client-container -v /etc/localtime:/etc/localtime:ro -p 0.0.0.0:8080:8080 -d hilton-client:1.0```  
server cd ../hiltontest/server（couchbase需用capella配置）  
```docker build -t hilton-client:1.0 .```  
```docker run --name hilton-client-container -v /etc/localtime:/etc/localtime:ro -p 0.0.0.0:8080:8080 -d hilton-client:1.0``` 
![image](https://github.com/hjj28810/HiltonTest/blob/main/assets/show5.png) 
## 技术选型
我本身并不是nodejs和纯前端开发，项目中要求的必要技术，大多是我第一次听说或使用，所以在满足所有必要的选项后，基于时间上的考虑，bouns的我就选了couchbase和docker，和其他一些我觉得好用方便的技术在里面，开发前，第一次接触的技术，我会先google，评估该技术的上手难易程度，等对所有技术看过一遍后，才开始编码，把相对方便容易的先写，整体逻辑框架先搭建完成，基本需求逻辑跑通，再加上其他的代码和功能，都是自己多次测试和验证的  
***`Express（nodejs web框架，容易上手，成熟度高，例子多）`***  
***`Log4js（著名的日志框架，我.net和golang开发也用的log4net和log4go）`***  
***`GraphQL.js（GraphQL原生库，使用方便）`***  
***`Supertest&Mocha（nodejs unit-test库，成熟高，例子多）`***  
***`ElementUI（前端vue框架，方便好用）`***  
***`Couchbase（必选项要求nosql，本来想用redis，后来看了下，这个也蛮方便的，正好学一下如何使用）`***  
***`Docker（现在大多数项目都部署docker，我本身公司项目也是部署docker和阿里云k8s）`***  
***`JWT（常规鉴权）`***  
***`接口验签（防重放，保证接口每次请求的唯一性和安全性）`***  
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
