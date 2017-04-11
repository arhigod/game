/////////////////////////////////////////////
//	weapon

$(document).on('click', '.weapon_list li', function() {
    var weaponIndex = $('.weapon_list li').index(this);
    var weaponData = [
        ['USP-S', 'Универсальный самозарядный полуавтоматический пистолет, к которому можно присоединить глушитель.','url(./img/pistol.png)'],
        ['AK-47', 'Чрезвычайно мощная штурмовая винтовка. Наиболее смертельна стрельба короткими и точными очередями.','url(./img/ak47.png)'],
        ['Sawed-Off', 'Помповый дробовик. Является модифицированной версией дробовика Remington 870 с обрезанным прикладом. Наносит огромный урон вблизи.','url(./img/shotgun.png)'],
        ['РПГ-7', 'Многоразовый ручной противотанковый гранатомёт. Может быть использован для уничтожения живой силы противника в укрытиях.','url(./img/rpg.png)']
    ];
    $(this).addClass('selected').siblings('li').removeClass('selected');
    $('.weapon .name').html(weaponData[weaponIndex][0]);
    $('.weapon .desc').html(weaponData[weaponIndex][1]);
    $('.weapon .icon').hide();
    $('.weapon .icon').css('background',weaponData[weaponIndex][2] + ' center top no-repeat');
    $('.weapon .icon').fadeIn('slow');
});

$(document).ready(function(e) {
    $('.weapon_list li')[0].click();
});

//////////////////////////////////////////
//	menu

var menuOffset;

$(window).scroll(function() {
    window.pageYOffset > menuOffset ? $('.menu').addClass('fixed') : $('.menu').removeClass('fixed');
});

$(document).ready(function() {
    menuOffset = $('.menu').offset().top;
    $(window).scroll();
});

//////////////////////////////////////////
//	menu scroll

$(document).on('click', '.menu > li', function() {
    var pagePos = [$('.weapons').offset().top - 55, $('.game').offset().top - 55, $('.classes').offset().top - 55, $('.media').offset().top - 55];
    var curIndex = $('.menu > li').index(this);
    $('body').scrollTo(pagePos[curIndex], 800, { queue: true });
});


///////////////////////////////////////////
//	classes

$(document).on('click', '.classes_layout .area', function() {
    var curIndex = $('.classes_layout .area').index(this) + 1;
    $('.classes_layout .desc.type' + curIndex).addClass('active');
});

$(document).on('click', '.classes_layout .arr', function() {
    var curIndex = $('.classes_layout .desc').index($(this).parent()) + 1,
        nextIndex,
        descLength = $('.classes_layout .desc').length;

    if ($(this).hasClass('left')) nextIndex = (curIndex == 1) ? descLength : curIndex - 1;
    if ($(this).hasClass('right')) nextIndex = (curIndex == descLength) ? 1 : curIndex + 1;

    $('.classes_layout .desc.type' + nextIndex).addClass('active').siblings('.desc').removeClass('active');
});

$(document).on('click', '.classes_layout .close', function() {
    $(this).parent().removeClass('active');
});

//////////////////////////////////////////
//	media

jQuery(document).ready(function() {
    jQuery('.jcarousel').jcarousel({
        wrap: 'both',
        scroll: 1
    });
    $(".fancybox").fancybox();
});

