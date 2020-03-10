const {override,fixBabelImports,addLessLoader} = require("customize-cra");

module.exports=override(
    fixBabelImports("import",{//按需加载样式
        libraryName:"antd",
        libraryDirectory:"es",
        style:true
    }),
    addLessLoader({//自定义主题颜色
        javascriptEnabled:true,
        modifyVars:{"@primary-color":"#1DA57A"}
    })
);