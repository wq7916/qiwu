/**
 * Created by wq on 2018/1/8.
 */
//文章api
var api = {
    //关注
    apiUrl: 'http://m.here-chic.com/apiController/',   //全局接口前缀
    pageNo: 1,
    pageNo0: 1, //page
    pageNo1: 1, //page
    pageSize: 4, //每次加载条数
    fansId: 10001,   //粉丝id当前登录的
    userIdOne: 10001,  //点赞id
    userName: 'wangqi',
    userPhotoUrl: 'https://himg.bdimg.com/sys/portrait/item/ad6ce4b88ae6b5b7e7919ee8a3b38eae.jpg',
    itemId: 10000000, //文章id
    userIdTwo: 10000, //被关注id
    userIdThree: 10004, //评论用户测试id
    type: 1,  //类型
    hf_commentid: '',
    hf_userid: '',
    index: '',
    hf_type: '',
    hf2_commentid:'',
    hf2_comment:'',
    init: function (index) {//初始化

        //关注
        $('body').on('click','.icon-focus',function () {
            api.focusOn(this);
        });

        //点赞
        $('body').on('click','.articleLike',function(){
            api.focusLike(this);
        });

        //收藏
        $('body').on('click','.icon-sc',function(){
            api.focusCollect(this);
        });

        //评论框
        var height = $(window).height() - 70;

        $('.kuan').click(function () {
            $('.comment-kuan').css('height',height+'px');
            $('.comment-input').animate({'bottom':0},500);
            $('.comment-input .pl').show();
        });

        $('.comment-kuan').click(function () {
            $('.comment-kuan').css('height',0);
            $('.comment-input').animate({'bottom':'-70px'},500);
            $('.comment-input span').hide();
        });


        //加载更多
        //最新
        $("#new_load0").click(function () {
            $("#new_load0 p").text("正在加载");
            setTimeout(function () {
                $("#new_load0 p").text("点击加载");
                api.tableSearch(true, 0);
            }, 800)
        });

        //最热
        $("#new_load1").click(function(){
            $("#new_load1 p").text("正在加载");
            setTimeout(function(){
                $("#new_load1 p").text("点击加载");
                api.tableSearch(true, 1);
            },800)
        });

        //tab切换
        $(".tab li").eq(0).find('.bottom_line').addClass("active");
        $(".tab li").eq(0).addClass("active1");
        $(".argue_con .argue").eq(0).show();
        $(".tab li").click(function(){
            var index = $(this).index();
            $(this).find('.bottom_line').addClass("active");
            $(this).addClass("active1");
            $(".argue_con .argue").eq(index).show();
            $(this).siblings().find('.bottom_line').removeClass("active");
            $(this).siblings().removeClass("active1");
            $(".argue_con .argue").eq(index).siblings().hide();
            api.tableSearch(false, index);
        });

        //评论
        $('.comment-input .pl').click(function (index) {
            var commentVal = $('.comment-input input').val();
            if(!commentVal){
                changeReminder('error','评论内容不能为空');
            }else{
                api.comment(commentVal,index);
            }
        });
        //评论回复
        $('body').on('click','.m_comment_list .icon_hf',function(){
            var t = $(this);
            api.hf_commentid = t.attr("data-commentid");//parentId
            api.hf_userid = t.attr("data-userId");//touserId

            api.hf2_commentid = t.parents(".m_comment_list_sj").find('.hf_box').attr("data-commentid");
            var hf_comment = t.parents(".m_comment_list_sj").find('.comment_name p').text();

            api.hf2_comment = '回复 @'+hf_comment+'：';

            $('.comment-kuan').css('height',height+'px');
            $('.comment-input').animate({'bottom':0},500);
            $('.comment-input .hf').show();

        });
        //对话回复
        $('body').on('click','.list .icon_hf1',function(){
            var t = $(this);
            api.index = $(this).parents('.list').index();
            api.hf_commentid = t.attr("data-commentid");//parentId
            api.hf_userid = t.attr("data-userId");//touserId
            api.hf_type = t.attr("data-isReply");
            $('.comment-kuan').css('height',height+'px');
            $('.comment-input').animate({'bottom':0},500);
            $('.comment-input .hf').show();

        });

        //回复
        $('.comment-inputhf .hf').click(function () {
            var commentHfVal = $('.comment-inputhf input').val();
            if(!commentHfVal){
                changeReminder('error','评论内容不能为空');
            }else{
                if(index == 1){
                    api.commentHf(commentHfVal, api.hf_userid, api.hf_commentid, api.hf2_commentid);
                }else{
                    api.commentHfList(commentHfVal, api.hf_commentid, api.hf_userid, api.index, api.hf_type);
                }

            }
        });
        //评论点赞
        $('body').on('click','.m_comment_list .icon_zan,.list .icon_zan1',function () {
            var commentId = $(this).attr('data-commentid');
            var num = parseInt($(this).text());
            if($(this).hasClass('active')){
                changeReminder('error', '本条评论已经点赞，请勿重复点击');
            }else{
                api.commentZan(commentId);
                $(this).addClass('active');
                $(this).text(num+1);
            }
        });

        //打开文章页多条评论数据
        $('body').on('click', '.js-open-dp', function () {
            var t = $(this);
            if (!t.hasClass('active')) {
                t.addClass('active');
                t.find('img').attr('src','http://m.cebnet.com.cn/upload/2017wapnewtu/comment_gb.png');
                t.parents('.m_comment_list_sj').find('.hf_gl').show();
            } else {
                t.removeClass('active');
                t.find('img').attr('src','http://m.cebnet.com.cn/upload/2017wapnewtu/comment_dk.png');
                t.parents('.m_comment_list_sj').find('.hf_gl').hide();
                t.parents('.m_comment_list_sj').find('.hf_box').find('.hf_gl:first-child').show();
            }
        })

        //图片变大对话
        $('body').on('click','.commonPic',function(){
            var imgUrl = $(this).attr('src');
            $('.picture').fadeIn();
            $('.picture .pic img').attr('src',imgUrl);
        })
        $('body').on('click','.picture',function(){
            $('.picture').hide();
        })

    },
    newsCounts:function (foucusCollect,foucusOn,foucusLike) { //是否关注（1:是 2:否）//是否收藏（1:是2:否）//点赞量
        $.ajax({
            url: this.apiUrl+'news/newsCounts.do?itemId='+this.itemId+'&userId='+this.userIdOne+'&type='+this.type,
            dataType: 'json',
            type:'GET',
            success: function (res) {
                var obj = eval(res);
                if(obj.state == 200){
                    if(obj.data.isFans == 1){
                        $(foucusOn).css('color','#f00');
                        $(foucusOn).removeClass('icon-guanzhu1');
                        $(foucusOn).addClass('icon-yiguanzhu');
                    }else{
                        $(foucusOn).css('color','#ccc');
                        $(foucusOn).removeClass('icon-yiguanzhu');
                        $(foucusOn).addClass('icon-guanzhu1');
                    }

                    if(obj.data.isFav == 1){
                        $(foucusCollect).css('color','#f00');
                    }else{
                        $(foucusCollect).css('color','#000');
                    }

                    $(foucusLike).find('span b').html(obj.data.supCount);
                }else{
                    changeReminder('error', '数据有误');
                }
            }
        })
    },
    focusOn: function (foucusOn) {
        $.ajax({
            url: this.apiUrl+'news/newsFans.do?fansId='+this.fansId+'&userId='+this.userIdTwo+'&type='+this.type,
            dataType: 'json',
            type:'GET',
            success: function (res) {
                var obj = eval(res);
                if(obj.state == 200){
                    if(obj.data.falg == 1){
                        changeReminder('success', '关注成功！');
                        $(foucusOn).css('color','#f00');
                        $(foucusOn).removeClass('icon-guanzhu1');
                        $(foucusOn).addClass('icon-yiguanzhu');
                    }else{
                        changeReminder('success', '取消关注成功！');
                        $(foucusOn).css('color','#ccc');
                        $(foucusOn).removeClass('icon-yiguanzhu');
                        $(foucusOn).addClass('icon-guanzhu1');
                    }
                }else{
                    changeReminder('error', '数据有误');
                }
            }
        })
    },
    focusLike: function (foucusLike) {//点赞
        $.ajax({
            url: this.apiUrl+'news/newsZan.do?itemId='+this.itemId+'&userId='+this.userIdOne+'&type='+this.type,
            dataType: 'json',
            type:'GET',
            success: function (res) {
                var obj = eval(res);
                if(obj.state == 200){
                    var num = parseInt($(foucusLike).find('span b').text());
                    console.log(num);
                    if(obj.data.status == 1){
                        changeReminder('success', '点赞成功！');
                        $(foucusLike).css('background','#f00');
                        num +=1;
                        $(foucusLike).find('span b').html(num);
                    }else{
                        changeReminder('success', '取消点赞成功！');
                        $(foucusLike).css('background','#ccc');
                        num -=1;
                        $(foucusLike).find('span b').html(num);

                    }
                }else{
                    changeReminder('error', '数据有误');
                }
            }
        })
    },
    focusCollect: function (foucusCollect) {
        $.ajax({
            url: this.apiUrl+'news/newsFav.do?itemId='+this.itemId+'&userId='+this.userIdOne+'&type='+this.type,
            dataType: 'json',
            type:'GET',
            success: function (res) {
                var obj = eval(res);
                if(obj.state == 200){
                    if(obj.data.falg == 1){
                        changeReminder('success', '收藏成功！');
                        $(foucusCollect).css('color','#f00');
                    }else{
                        changeReminder('success', '取消收藏成功！');
                        $(foucusCollect).css('color','#000');
                    }
                }else{
                    changeReminder('error', '数据有误');
                }
            }
        })
    },
    tableSearch: function (flag,index) { //评论
        var argue_hot = $(".argue_hot"+index);
        var num = '';
        if(index == 0){
            num = this.pageNo0;
        }else{
            num = this.pageNo1;
        }
        if(!flag){
            argue_hot.html("");
            num = 1;
        }else{
            num ++;
            this.pageNo0 = num;
            this.pageNo1 = num;
        }
        $.ajax({
            url: this.apiUrl+'news/commentList.do?itemid='+this.itemId+'&pageNo='+num+'&pageSize='+this.pageSize+'&itemType='+this.type+'&sortType='+(index+1),
            dataType:'json',
            success:function(data){
                if(data != null ) {
                    var obj = eval(data);
                    var totalPages = Math.ceil(obj.data.total/4); //页数
                    if(num == totalPages || totalPages == 1){
                        $("#new_load"+index).hide();
                    }

                    var obj_commentList = obj.data.rows;
                    $('.number').text(obj.data.total);
                    if(obj_commentList.length) {
                        for (var j = 0; j < obj_commentList.length; j++) {

                            argue_hot.append('<section class="m_comment_list"><div class="m_comment_list_sj"><div class="comment_author fl"><img src="' + obj_commentList[j].userPhoto + '" alt="普通评论"></div><div class="comment_name fl"><p>' + obj_commentList[j].userName + '</p><span>' + dateToStr(new Date(obj_commentList[j].commentTime)) + '</span></div><div class="clearfix"></div> <div class="argue_content"><p>' + obj_commentList[j].commentContent + '</p> </div> <div class="action"> <span class="icon_zan" data-commentid="' + obj_commentList[j].id + '" data-itemId="' + obj_commentList[j].itemId + '" data-userId="' + obj_commentList[j].userId + '">' + obj_commentList[j].supportNum + '</span><span class="icon_hf icon_' + obj_commentList[j].userId + '" data-commentid="' + obj_commentList[j].id + '" data-itemId="' + obj_commentList[j].itemId + '" data-userId="' + obj_commentList[j].userId + '">回复</span></div><div class="hf_box" data-commentid="' + obj_commentList[j].id + '"></div></div><div class="comment_bottom"></div></section>');

                            if (obj_commentList[j].replyList) {

                                argue_hot.find('.hf_box').each(function () {

                                    for (var i = 0; i < obj_commentList[j].replyList.length; i++) {

                                        if (obj_commentList[j].id == obj_commentList[j].replyList[i].parentId && $(this).attr('data-commentid') == obj_commentList[j].replyList[i].parentId) {

                                            $(this).prepend('<div class="hf_gl"><h1><img src="' + obj_commentList[j].replyList[i].userPhoto + '" alt="普通评论"><span>' + obj_commentList[j].replyList[i].userName + '</span>' + dateToStr(new Date(obj_commentList[j].replyList[i].commentTime))+ '</h1><p>' + obj_commentList[j].replyList[i].commentContent + '</p></div>');

                                        }

                                    }
                                    if($(this).find('.hf_gl').length > 1){

                                        $(this).append('<div class="bottom-more bottom-more-pl js-open-dp"><img src="http://m.cebnet.com.cn/upload/2017wapnewtu/comment_dk.png" alt="普通评论"></div>');

                                    }

                                });
                            }
                        }

                    }
                    else{
                        $("#new_load"+index).hide();
                        if(index == 0){
                            argue_hot.append('<div class="white_null0 white_null"><img src="http://m.cebnet.com.cn/upload/2017wapcssjs/img/wutishi.png" alt="普通评论"><p>暂无评论</p></div>');
                        }else{
                            argue_hot.append('<div class="white_null1 white_null"><img src="http://m.cebnet.com.cn/upload/2017wapcssjs/img/wutishi.png" alt="普通评论"><p>暂无评论</p></div>');
                        }

                    }
                }
            }
        })
    },
    comment: function (val,commentType) {
        $.ajax({
            url: this.apiUrl+'news/addNewsComment.do?itemId='+this.itemId+'&userId='+this.userIdThree+'&itemType='+this.type+'&content='+val+'&userName='+this.userName+'&userPhoto='+this.userPhotoUrl,
            dataType: 'json',
            type:'GET',
            success: function (res) {
                var obj = eval(res);
                if(obj.state == 200){
                    changeReminder('success', '评论成功');
                    $('.comment-kuan').css('height',0);
                    $('.comment-input').animate({'bottom':'-70px'},500);
                    $('.comment-input input').val();
                    setTimeout(function () {
                        var now_time = new Date();
                        if(commentType == 1){
                            $(".argue_hot").prepend('<section class="m_comment_list"><div class="m_comment_list_sj"><div class="comment_author fl"><img src="' + api.userPhotoUrl + '" alt="普通评论"></div><div class="comment_name fl"><p>' + api.userName + '</p><span>' + dateToStr(now_time) + '</span></div><div class="clearfix"></div> <div class="argue_content"><p>' + val + '</p></div></div></section>');
                        }else{
                            $("#content").append('<section class="list clearfix"><div class="list_head fl"><img src="' + api.userPhotoUrl + '"></div><div class="list_content right10 fl"><p class="name left">' + api.userName + '</p><p class="article_word first_people fl"><span>' + val + '</span></p><div class="clearfix"></div></div></section>');
                            api.scrollBottom();
                        }

                    }, 2000)
                }else{
                    changeReminder('error', '数据有误');
                }
            }
        })
    },
    commentHf: function (val,touserId,parentId,hf2_commentid) { //文章页回复
        $.ajax({
            url: this.apiUrl+'news/addNewsComment.do?itemId='+this.itemId+'&userId='+this.userIdThree+'&itemType='+this.type+'&content='+val+'&userName='+this.userName+'&userPhoto='+this.userPhotoUrl+'&parentId='+parentId+'&touserId='+touserId,
            dataType: 'json',
            type:'GET',
            success: function (res) {
                var obj = eval(res);
                if(obj.state == 200){
                    changeReminder('success', '回复评论成功');
                    $('.comment-kuan').css('height',0);
                    $('.comment-input').animate({'bottom':'-70px'},500);
                    $('.comment-input input').val('');
                    $('.comment-input span').hide();
                    if(parentId == hf2_commentid){
                        var now_time = new Date();
                        $(".hf_box").each(function(){
                            if($(this).attr("data-commentid") == parentId && $(this).attr("data-commentid") == hf2_commentid){
                                $(this).prepend('<div class="hf_gl"><h1><img src="'+api.userPhotoUrl +'" alt="普通评论"><span>'+api.userName+'</span>'+dateToStr(now_time)+'</h1><p>'+val+'</p></div>')
                            }
                        })
                    }

                }else{
                    changeReminder('error', '数据有误');
                }
            }
        })
    },
    tableSearchList: function (flag) { //评论对话
        if(!flag){
            this.pageNo = 1;
        }else{
            this.pageNo ++;
        }
        $.ajax({
            url: this.apiUrl+'news/commentList.do?itemid='+this.itemId+'&pageNo='+this.pageNo+'&pageSize='+this.pageSize+'&itemType='+this.type+'&sortType=1',
            dataType:'json',
            success:function(data){
                if(data != null ) {
                    var obj = eval(data);
                    var totalPages = Math.ceil(obj.data.total/4); //页数
                    if(this.pageNo == totalPages || totalPages == 1){
                        //$("#new_load"+index).hide();
                    }
                    var obj_commentList = obj.data.rows;
                    $('.number').text(obj.data.total);
                    if(obj_commentList.length) {
                        for (var j = 0; j < obj_commentList.length; j++) {

                            $('#content').append('<section class="list clearfix"><div class="list_head fl"><img src="'+ obj_commentList[j].userPhoto +'"></div><div class="list_content right10 fl"><p class="name left">'+ obj_commentList[j].userName +'</p><p class="article_word first_people fl"><span>'+ obj_commentList[j].commentContent +'</span></p><div class="clearfix"></div><div class="action1 action3"><span class="icon_zan1" data-commentid="' + obj_commentList[j].id + '" data-itemId="' + obj_commentList[j].itemId + '" data-userId="' + obj_commentList[j].userId + '">'+ obj_commentList[j].supportNum +'</span><span class="icon_hf1" data-commentid="' + obj_commentList[j].id + '" data-itemId="' + obj_commentList[j].itemId + '" data-userId="' + obj_commentList[j].userId + '" data-isReply="'+obj_commentList[j].isReply+'"></span></div></div></section>');

                            if (obj_commentList[j].replyList) {

                                for (var i = 0; i < obj_commentList[j].replyList.length; i++) {
                                    $('#content').append('<section class="list clearfix"><div class="list_head fr"><img src="' + obj_commentList[j].replyList[i].userPhoto + '"></div><div class="list_content left10 fr"><p class="name right">' + obj_commentList[j].replyList[i].userName + '</p><p class="article_word fr second_people"><span>' + obj_commentList[j].replyList[i].commentContent + '</span></p><div class="clearfix"></div><div class="action1 action2"><span class="icon_zan1" data-commentid="' + obj_commentList[j].replyList[i].id + '" data-itemId="' + obj_commentList[j].replyList[i].itemId + '" data-userId="' + obj_commentList[j].replyList[i].userId + '">' + obj_commentList[j].replyList[i].supportNum + '</span><span class="icon_hf1" data-commentid="' + obj_commentList[j].replyList[i].parentId + '" data-itemId="' + obj_commentList[j].replyList[i].itemId + '" data-userId="' + obj_commentList[j].replyList[i].userId + '" data-isReply="'+obj_commentList[j].replyList[i].isReply+'"></span></div></div></section>');
                                }
                            }
                        }

                    }
                    api.scrollBottom();
                }
            }
        })
    },
    commentZan: function (commentId) {
        $.ajax({
            url: this.apiUrl+'news/comZan.do?comId='+commentId,
            dataType: 'json',
            type:'GET',
            success: function (res) {
                var obj = eval(res);
                if(obj.state == 200){
                    changeReminder('success', '点赞成功');

                }else{
                    changeReminder('error', '数据有误');
                }
            }
        })
    },
    commentHfList: function (val, commentId, userId, index, hf_type) {
        $.ajax({
            url: this.apiUrl+'news/addNewsComment.do?itemId='+this.itemId+'&userId='+this.userIdThree+'&itemType='+this.type+'&content='+val+'&userName='+this.userName+'&userPhoto='+this.userPhotoUrl+'&parentId='+commentId+'&touserId='+userId,
            dataType: 'json',
            type:'GET',
            success: function (res) {
                var obj = eval(res);
                if(obj.state == 200){
                    changeReminder('success', '回复评论成功');
                    $('.comment-kuan').css('height',0);
                    $('.comment-input').animate({'bottom':'-70px'},500);
                    $('.comment-input input').val('');
                    $('.comment-input span').hide();
                    if(hf_type==1){
                        $('#content section').eq(index).after('<section class="list clearfix"><div class="list_head fr"><img src="' + api.userPhotoUrl + '"></div><div class="list_content left10 fr"><p class="name right">' + api.userName + '</p><p class="article_word fr second_people"><span>' + val + '</span></p></div></section>');
                    }else{
                        $('#content section').eq(index).after('<section class="list clearfix"><div class="list_head fl"><img src="' + api.userPhotoUrl + '"></div><div class="list_content right10 fl"><p class="name left">' + api.userName + '</p><p class="article_word first_people fl"><span>'+ val +'</span></p></div></section>');
                    }

                }else{
                    changeReminder('error', '数据有误');
                }
            }
        })
    },
    scrollBottom: function () {
        var windowHeight = $(window).height() - $('.next').height() - $('.titleShow').height();
        var content = document.getElementById('content');
        var nowHeight = content.offsetHeight;
        var height = nowHeight - windowHeight;
        if(nowHeight >= windowHeight) {
            $("body,html").animate({scrollTop:height},500);
        }
    }
};

//对话apiList
var apiList = {
    THIS_DOMAIN: 'http://m.here-chic.com',
    itemId: '10000109',
    obj: [],
    i: 0,
    isover: false,
    init: function () {
        $.ajax({
            url:this.THIS_DOMAIN+'/api/list.do?newsId='+this.itemId,
            type:'GET',
            dataType:'json',
            success:function (res) {
                if(res.success){
                    apiList.obj = res.obj;
                    add(apiList.i);
                }
            }
        });

        //3秒钟自动播放
        var timer = setInterval(autoPlay,3000);

        function autoPlay(){
            apiList.i += 1;
            if(apiList.i > apiList.obj.length -1){
                if(!apiList.isover){//最后一次加载footer
                   var imgsrc = apiList.THIS_DOMAIN+"/images/footer2.jpg";
                   var html = '<section class="clearfix"><h2 class="footer_desc">完结</h2><a href="http://m.here-chic.com/chic/index.do"><img src="'+imgsrc+'" class="footer_pic"/></a></section>';
                   $('.content').append(html);
//                    loadImg(imgsrc,100000);
                    api.tableSearchList(false);
                    $('.comment').css('z-index',2);
                }else{//完结后 再次点击next加载 提示
                    //$('.endfloat').fadeIn();
                    // changeReminder('success','本文完结谢谢欣赏');
                    $('.comment').css('z-index',2);
                    api.tableSearchList(true);
                }
                apiList.isover = true;
            }else{
                if(add(apiList.i)){
                    api.scrollBottom();
                }
            }
        }

        function add(i){
            var html = '';
            var roleAvatar = apiList.THIS_DOMAIN + apiList.obj[i].roleAvatar;
            var roleName = apiList.obj[i].roleName;
            var roleType = apiList.obj[i].roleType;

            var type = apiList.obj[i].type;
            var link = apiList.obj[i].link;
            var keyword = apiList.obj[i].keyword;
            var content = apiList.obj[i].content;

            if(type == 1 && keyword != null && keyword != "" && link != null && link != ""){
                content = content.replace(keyword,'<a href="'+link+'">'+keyword+'</a>');
            }

            if(type == 2){//图片
                var imgsrc = apiList.THIS_DOMAIN+content;
                loadImg(imgsrc, apiList.i);//加载图片
                if(link != null && link != ""){
                    if(roleType == 0){
                        content = '<a href="'+link+'" class="linkimg"><img src="'+imgsrc+'" class="aside_tu"/></a>';//旁白需要多加个样式
                    }else{
                        content = '<a href="'+link+'" class="linkimg"><img src="'+imgsrc+'" class="article_tu"/></a><span>【点图购买】</span>';
                    }
                }else{
                    if(roleType == 0){
                        content = '<img src="'+imgsrc+'" class="aside_tu_noa commonPic" />';//旁白需要多加个样式
                    }else{
                        content = '<img src="'+imgsrc+'" class="article_tu_noa commonPic" />';
                    }
                }
            }

            if(roleType === 1){//主角
                if(type === 1){//文字
                    html = '<section class="list clearfix"><div class="list_head fl"><img src="'+roleAvatar+'"></div><div class="list_content right10 fl"><p class="name left">'+roleName+'</p><p class="article_word first_people fl"><span>'+content+'</span></p></div></section>';
                }
                if(type === 2){//图片
                    html = '<section class="list clearfix"><div class="list_head fl"><img src="'+roleAvatar+'"></div><div class="list_content right10 fl"><p class="name left">'+roleName+'</p><p class="shopShow">'+content+'</p></div></section>';
                }
            }

            if(roleType === 2){//配角
                if(type === 1){
                    html = '<section class="list clearfix"><div class="list_head fr"><img src="'+roleAvatar+'"></div><div class="list_content left10 fr"><p class="name right">'+roleName+'</p><p class="article_word fr second_people"><span>'+content+'</span></p></div></section>';
                }
                if(type === 2){
                    html = '<section class="list clearfix"><div class="list_head fr"><img src="'+roleAvatar+'"></div><div class="list_content left10 fr"><p class="name right">'+roleName+'</p><p class="fr shopShow">'+content+'</p></div></section>';
                }
            }

            if(roleType === 0){//旁白
                if(type === 1){
                    html = '<section class="clearfix"><h2 class="hyy">画外音</h2><p class="aside_people">'+content+'</p></section>';
                }
                if(type === 2){
                    html = '<section class="clearfix"><h2 class="hyy">画外音</h2>'+content+'</section>';
                }
            }

            $('.content').append(html);
            return true;
        }

        function loadImg(src, index) {
            var img = new Image();
            img.src = src;
            img.onload = function() {
                $('.face-'+ index).attr('src', src);
                api.scrollBottom();
            }
        }

        //点击按钮阅读
        $('.main').click(function (e){
            clearInterval(timer);
            var  _con = $('.commonPic,.icon_hf1,.icon_zan1,.picture span img');
            if(!_con.is(e.target) && _con.has(e.target).length === 0){
                apiList.i += 1;
                if(apiList.i > apiList.obj.length -1){
                    if(!apiList.isover){//最后一次加载footer
                       var imgsrc = apiList.THIS_DOMAIN+"/images/footer2.jpg";
                       var html = '<section class="clearfix"><h2 class="footer_desc">完结</h2><a href="http://m.here-chic.com/chic/index.do"><img src="'+imgsrc+'" class="footer_pic"/></a></section>';
                       $('.content').append(html);
//                        loadImg(imgsrc,100000);
                        api.tableSearchList(false);
                        $('.comment').css('z-index',2);
                    }else{//完结后 再次点击next加载 提示
                        //$('.endfloat').fadeIn();
                        // changeReminder('success','本文完结谢谢欣赏');
                        $('.comment').css('z-index',2);
                        api.tableSearchList(true);
                    }
                    apiList.isover = true;
                }else{
                    if(add(apiList.i)){
                        api.scrollBottom();
                    }
                }

                $('section .aside_tu').each(function () {
                    var width = $(this).width();
                    if(width==0) width=250;
                    if(width > 250){
                        $(this).css('width','250px');
                    }else{
                        $(this).css('width',width+'px');
                    }
                })

                //到10的时候锁屏
                if(apiList.i == 10){
                    //loveHereChicFun();
                }

            }
        });
    }

};

//公用提示
function changeReminder(zt,bt){
    if(zt=='success'){
        $('.reminder').removeClass('error');
    }else{
        $('.reminder').removeClass('success');
    }
    $('.reminder').html(bt);
    $('.reminder').addClass(zt);
    $('.reminder').slideDown();
    setTimeout(function(){
        $('.reminder').slideUp();
    },1500)
}


//时间格式转换

function dateToStr(datetime){
    var year = datetime.getFullYear();
    var month = datetime.getMonth()+1;//js从0开始取
    var date = datetime.getDate();
    var hour = datetime.getHours();
    var minutes = datetime.getMinutes();
    var second = datetime.getSeconds();

    if(month<10){
        month = "0" + month;
    }
    if(date<10){
        date = "0" + date;
    }
    if(hour <10){
        hour = "0" + hour;
    }
    if(minutes <10){
        minutes = "0" + minutes;
    }
    if(second <10){
        second = "0" + second ;
    }

    var time = year+"-"+month+"-"+date+" "+hour+":"+minutes+":"+second; //2009-06-12 17:18:05

    return time;
}
