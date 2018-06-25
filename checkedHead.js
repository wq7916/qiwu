var par = 'par={"newsId":10000785,"pageNo": 1,"pageSize": 20}';
$.ajax({
    url: 'http://m.here-chic.com/app/role/getListByNewsId.do?'+encodeURI(par),
    type: 'GET',
    dataType: 'json',
    success: function (obj) {

        if (obj.resCode === "200") {
            var arr = obj.resData.rows;
            console.log(arr)
            var html = '', num = 0;
            for(var i = 0; i < arr.length; i++){
                if(arr[i].avatar !== ' ') {
                    num ++;
                    html += '<li data-name="'+arr[i].name+'" data-avatar="'+arr[i].avatar+'"><img src="'+arr[i].avatar+'"><p>'+arr[i].name+'</p></li>'
                }
            }
            $('#scroller ul').append(html);
            $('#scroller').width(num * 56 + 4); // 计算scroller的宽度
            loaded();
            headCheck();
        }
    }
})

// 头像滚动
var myScroll;

function loaded() {
    myScroll = new IScroll('#wrapper', {
        scrollX: true,
        scrollY: false,
        click: true,
        bounce: true
    })
}
document.addEventListener('touchmove', function (e) { e.preventDefault(); }, isPassive() ? {
    capture: false,
    passive: false
} : false);

function isPassive() {
    var supportsPassiveOption = false;
    try {
        addEventListener("test", null, Object.defineProperty({}, 'passive', {
            get: function () {
                supportsPassiveOption = true;
            }
        }));
    } catch(e) {}
    return supportsPassiveOption;
}

// 头像选中

function headCheck() {
    $('#scroller ul li').click(function () {
        $(this).find('img').addClass('active').parent('li').siblings().find('img').removeClass('active');
        var dataAvatar = $(this).attr('data-avatar');
        var dataName = $(this).attr('data-name');
        console.log(dataAvatar + dataName);
    })
}