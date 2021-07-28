//pcheader
$(document).ready(function () {
    const $gnb = $('#pcgnb > ul');
    const $gnbDep2 = $gnb.find('li ul');
  
    $gnbDep2.hide();
  
    $(window).on('scroll', function () {
      if ($(this).scrollTop() > 10) {
        $('#pcheader').addClass('on');
      } else {
        $('#pcheader').removeClass('on');
      }
    });
    $gnb.children().on('mouseenter focusin', function () {
      // depth1 li.on 제어
      $(this).addClass('on').siblings('li.on').removeClass('on');
      // depth2 ul 열리기
      $gnbDep2.stop().slideDown();
      // 필수 아님 : 현재 디자인 컨셉 - depth1과 depth2를 구별하기 위한 가상요소
      $('#pcheader').addClass('on').find('#pcgnb').addClass('active');
    });
  
    $gnb.on('mouseleave', function () {
      // depth1 li.on 제거 하고 depth2 ul 닫기 => #gnb.active 제거
      $(this).children().removeClass('on').children('ul').stop().slideUp(function () {
        // 추가사항 : 1) #gnb.active 제거 2) #pcheader.on 제거 #gnb.active 제거 
        if ($(window).scrollTop() > 10) {
          $('#gnb').removeClass('active');
        } else {
          $('#pcheader').removeClass('on').find('#gnb').removeClass('active');
        }
      });
    });
  
    // 4) 첫번째 a, 마지막 a 에서 키보드(blur)
    // 첫번째 a : shift + tab
    $gnb.find('a').first().on('keydown', function (e) {
      console.log(e.keyCode); //tab : 9, 오른쪽 shift : 16
      if ((e.shiftKey || e.keyCode === 16) && e.keyCode === 9) $gnb.trigger('mouseleave');
    });
    // 마지막 a : shift (x) , tab만 누르는 경우
    $gnb.find('a').last().on('keydown', function (e) {
      if ((!e.shiftKey || e.keyCode !== 16) && e.keyCode === 9) $gnb.trigger('mouseleave');
    });
  
});


//mheader
$(document).ready(function() {
    /* 
    전체메뉴 열기 클릭
    1) 스크롤 제어 : #wrap의 높이값을 html, body 높이로 강제 지정
    2) .gnb_wrap 보여지게 처리 : visibility, animate() - left 0px => 첫번째 요소에 포커스 강제 이동
    3) 첫번째 포커스요소와 마지막 포커스 요소 제어 - 키보드 트래핑
    전체메뉴 닫기 클릭
    1) html, body 에 지정한 높이를 제거 - removeAttr('style')
    2) .gnb_wrap 숨겨지게 처리 : animate() - left 100% => 완료함수로 visibility => 열기버튼으로 포커스 강제 이동
    추가사항) #gnb li.on 제거 열려진 뎁스2 ul은 숨기기
    */
  
    // 전체메뉴 열기 클릭 => 닫기 이벤트 함께 처리
    $('.gnb_open_btn').on('click', function () {
      // 0) 변수 설정
      const $openBtn = $(this);
      const $first = $openBtn.next().find('.first');
      const $last = $openBtn.next().find('.last');
  
      // 1) 스크롤 제어 : #wrap의 높이값을 html, body 높이로 강제 지정 
      const wrapHei = $('#wrap').outerHeight();
      console.log(wrapHei);
      $('html, body').css({height: wrapHei, overflow: 'hidden'});
  
      // 2) .gnb_wrap 보여지게 처리 : visibility, animate() - left 0px => 첫번째 요소에 포커스 강제 이동
      $openBtn.next().css('visibility', 'visible').stop().animate({left: 0});
      $first.focus();
  
      // 3) 첫번째 포커스요소와 마지막 포커스 요소 제어 - 키보드 트래핑
      $first.on('keydown', function (e) {
        console.log(e.keyCode); //tab => 9
        if (e.shiftKey && e.keyCode === 9) {
          e.preventDefault();
          $last.focus();
        }
      });
      $last.on('keydown', function (e) {
        if (!e.shiftKey && e.keyCode === 9) {
          e.preventDefault();
          $first.focus();
        }
      });
  
      // 닫기 버튼 클릭이벤트
      $last.on('click', function () {
        // 1) html, body 에 지정한 높이를 제거 - removeAttr('style')
        $('html, body').removeAttr('style');
  
        // 2) .gnb_wrap 숨겨지게 처리 : animate() - left 100% => 완료함수로 visibility => 열기버튼으로 포커스 강제 이동
        $last.parent().stop().animate({left: '100%'}, function () {
          // $(this).css('visibility', 'hidden'); //열려진 뎁스2 닫지 않는 경우
  
          // 추가사항) #gnb li.on 제거 열려진 뎁스2 ul은 숨기기
          $(this).css('visibility', 'hidden').find('#gnb ul li.on').removeClass('on').children('ul').css({maxHeight: 0, visibility: 'hidden'});
          
          $openBtn.focus();
        });
      });
  
    });
  
    // 네비게이션 열리고 닫기기(#gnb depth1 a 클릭)
    $('#gnb > ul > li > a').on('click', function () {
      if ($(this).next().length === 0) {  //뎁스1a 만 있는 경우
        return true;
      } else { //뎁스2 ul까지 있는 경우
        // 열려질 ul의 높이를 스크립트로 지정하여 변수 설정 : li의 높이(margin포함), li의 개수 => li의 높이 x  li의 개수 = ul 높이를 알수 있다
        const liHei = $(this).next().children().outerHeight(true);
        const liSize = $(this).next().children().length;
        const ulHei = liHei * liSize;
        console.log(liHei, liSize, ulHei);
  
        // 초기화 추가 설정: 미리 열려진 다른 메뉴 닫아주기
        $(this).parent().siblings().removeClass('on').children('ul').stop().animate({maxHeight: 0}, function () {
          $(this).css({visibility: 'hidden'});
        });
  
        if ($(this).parent().hasClass('on')) { //현재 클릭해서 열려져 있는 경우
          $(this).parent().removeClass('on').children('ul').stop().animate({maxHeight: 0}, function () {
            $(this).css({visibility: 'hidden'});
          });
          
          /* $(this).next().stop().animate({maxHeight: 0}, function () {
            $(this).css({visibility: 'hidden'});
          }).parent().removeClass('on'); */
        } else { //열려져 있지 않은 경우: ul -> visibility -> animate() -> 부모li.on
          $(this).next().css({visibility: 'visible'}).stop().animate({maxHeight: ulHei}).parent().addClass('on');
  
        }
      }
      return false;
    });


    // top 이동 버튼
	$(".btn_top").on("click", function () {
		$("html, body").stop().animate({scrollTop: 0});
		return false;
	});


  
  });