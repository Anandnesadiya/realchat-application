module.exports=function (app,server){
    require('./routes')(app);
    require('./socket')(app,server);
}