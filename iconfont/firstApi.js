/**
 * Created by wq on 2018/1/22.
 */
var api = {
    url: 'http://m.here-chic.com/apiController/',
    category: ['103','104','103','104'],
    userId: '32812',
    categoryMore: [],
    sign: '88888888',
    limit: '5',
    offset: 1,
    total: 0,
    index: 0,
    timers: null,
    pid: 101,
    list: function (id) {
        return encodeURI('par={"pid":"'+id+'","sign": "'+api.sign+'"}');
    },
    coding: function (id) {
        return encodeURI('par={"category":"'+id+'","sign": "'+api.sign+'"}');
    },
    coding2: function (id) {
        return encodeURI('par={"category":"'+id+'","limit":"'+api.limit+'","offset":"'+api.offset+'","sign": "'+api.sign+'"}');
    },
    coding3: function () {
      return encodeURI('par={"userId":"'+api.userId+'","limit":"'+api.limit+'","offset":"'+api.offset+'","sign": "'+api.sign+'"}')
    },
    isStatus: function (status) {
        if(!status){
            return '未接单';
        } else {
            if(status === 1) {
                return '已接单'
            } else {
                return '未接单'
            }
        }

    },
    isTrue: function (status) {
        if(!status){
            return 'stateN';
        } else {
            if(status === 1) {
                return 'stateY'
            } else {
                return 'stateN'
            }
        }
    },
    listXs: function (i) {
        var num = i;
        $.ajax({
            url: this.url+'discuss/reward.do?'+this.coding3(),
            type:'POST',
            dataType:'json',
            success:function (res) {
                if (res.resCode == 200) {
                    var obj = res.resData.rows;
                    var html = '';
                    for(var i = 0;i< obj.length; i++) {
                        if(obj[i].googsPic) {
                            html += '<section class="list clearfix"><div class="list_head fl"><img src="'+obj[i].userPhoto+'"></div><div class="list_content right10 fl"><p class="name left">'+obj[i].userName+'</p><div class="article_word first_people fl"><div class="con"><div class="conLeft"><p>'+obj[i].goodsDesc+'</p></div><div class="conRight"><img src="'+obj[i].googsPic.split(',')[0]+'"></div></div><div class="bottom clearfix"><span class="time">'+obj[i].postTime+'</span><span class="state '+api.isTrue(obj[i].status)+'">'+api.isStatus(obj[i].status)+'</span></div></div></div></section>';
                        }else {
                            html += '<section class="list clearfix"><div class="list_head fl"><img src="'+obj[i].userPhoto+'"></div><div class="list_content right10 fl"><p class="name left">'+obj[i].userName+'</p><div class="article_word first_people fl"><div class="con"><div class="conLeft"><p>'+obj[i].goodsDesc+'</p></div></div><div class="bottom clearfix"><span class="time">'+obj[i].postTime+'</span><span class="state '+api.isTrue(obj[i].status)+'">'+api.isStatus(obj[i].status)+'</span></div></div></div></section>';
                        }
                        if(obj[i].reward){
                            html += '<section class="list clearfix"><div class="list_head fr"><img src="'+obj[i].userPhoto+'"></div><div class="list_content left10 fr"><p class="name right">'+obj[i].userName+'</p><div class="article_word first_people fr"><div class="con"><div class="conLeft"><p class="back000">'+obj[i].goodsDesc+'</p></div></div><div class="bottom clearfix"><span class="time">'+obj[i].postTime+'</span><span class="state '+api.isTrue(obj[i].status)+'">'+api.isStatus(obj[i].status)+'</span></div></div></div></section>';
                        }
                    }
                    $('.content').append(html);
                    api.offset += 1;
                } else {
                    console.log('暂无数据')
                }
            }
        })
    },
    listHeader: function () {
        $.ajax({
            url: this.url+'news/category.do?'+this.list(api.pid),
            type:'POST',
            dataType:'json',
            success:function (res) {
                if (res.resCode == 200) {
                    api.categoryMore = res.resData.categoryList
                    api.addHeader();
                    api.listFontTwo(0);
                    api.listMore(0);
                }
            }
        })
    },
    addHeader: function () {
        $('.hd ul').html('')
        var html = ''
        for(var i = 0; i< api.categoryMore.length; i++){
            html += '<li>'+api.categoryMore[i].cateName+'<i></i></li>'
        }
        $('.hd ul').append(html);

        $('.hd li').eq(0).addClass('active');
        $('.hd li').eq(0).find('i').show();
        $('.list_content .list').eq(0).show();
        $('.hd li').click(function () {
            var index = $(this).index();
            $(this).addClass('active');
            $(this).siblings().removeClass('active');
            $(this).find('i').show();
            $(this).siblings().find('i').hide();
            $('.list_content ul').html('');
            api.index = index;
            api.listFontTwo(index);
            api.listMore(index);
            api.offset = 1;
        });
    },
    listFontTwo: function (i) {
        var num = i;
        $.ajax({
            url: this.url+'news/index.do?'+this.coding(api.categoryMore[i].id),
            type:'POST',
            dataType:'json',
            success:function (res) {
                if(res.resCode == 200){
                    var obj = res.resData;
                    if(obj.newsZhoList){
                        var html1 = '';
                        var html2 = '';
                        for(var i=0;i<obj.newsZhoList.length;i++){
                            html2 += '<section><img src="'+obj.newsZhoList[i].photourl+'" class="pic_tu"><div class="list_bottom"><p class="title">'+obj.newsZhoList[i].title+'</p><div class="line"></div><p><i class="iconfont icon-guancha"></i><span>'+obj.newsZhoList[i].count+'</span><i class="iconfont icon-shijian"></i><span>'+obj.newsZhoList[i].count+'</span></p></div><div class="list_logo"><img src="images/logo.png"><p>chic绮物论</p></div></section>';
                        }
                        html1 = '<li class="listContentMore"><div class="content">'+html2+'</div></li>';
                        $('.list_content ul').prepend(html1);
                    }
                    if(obj.newsBan){
                        var html = '<li class="listContent"><img src="'+obj.newsBan.photourl+'" class="pic_tu"><div class="list_bottom"><p class="title">'+obj.newsBan.title+'</p><div class="line"></div><p><i class="iconfont icon-guancha"></i><span>'+obj.newsBan.count+'</span><i class="iconfont icon-shijian"></i><span>'+obj.newsBan.pageview+'</span></p></div><div class="list_logo"><img src="images/logo.png"><p>chic绮物论</p></div></li>';
                        $('.list_content ul').prepend(html);
                    }

                }
            }
        });
    },
    listMore: function (i) {
        var num = i;
        $.ajax({
            url: this.url+'news/newsList.do?'+this.coding2(api.categoryMore[i].id),
            type: 'POST',
            dataType: 'json',
            success: function (res) {
                var obj = res.resData;
                api.total = obj.total;
                if(api.offset <= Math.ceil(api.total/5) && res.resData.rows.length){
                    var html = '';
                    for(var i=0;i<obj.rows.length;i++){
                        html += '<li class="listContent"><img src="'+obj.rows[i].photourl+'" class="pic_tu"><div class="list_bottom"><p class="title">'+obj.rows[i].title+'</p><div class="line"></div><p><i class="iconfont icon-guancha"></i><span>'+obj.rows[i].count+'</span><i class="iconfont icon-shijian"></i><span>'+obj.rows[i].pageview+'</span></p></div><div class="list_logo"><img src="images/logo.png"><p>chic绮物论</p></div></li>';
                    }
                    $('.list_content ul').append(html);
                    api.offset += 1;
                }else{
                    console.log('到底了');
                }

            },
            error: function (e) {
                console.log(e);
            }
        })
    }

}