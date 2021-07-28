// cnt1

// cnt2
$(document).ready(function () {
  const swiper = new Swiper('#cnt2 .swiper-container', {
    // 필요한 옵션 추가
    direction: 'horizontal',  //vertical수직방향이동
    loop: true,

    // Navigation arrows
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },

    autoplay: {
        delay: 3000,
    }
    
  });
  // 자동실행과 일시정지 버튼 추가
  $('#cnt2 .swiper-auto-wrap button').on('click', function () {
    const btnNum = $(this).index();
    console.log(btnNum);  //자동실행0,일시정지1 
    if (btnNum === 0) {
      swiper.autoplay.start();
    } else {
      swiper.autoplay.stop();
    }
    $(this).addClass('hidden').siblings().removeClass('hidden');
  });

});

//cnt3
$(document).ready(function () {
  const swiper = new Swiper('#cnt3 .swiper-container', {
        direction: 'horizontal',
        slidesPerView: 5,
        centeredSlides: true,
        loop: true,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        breakpoints: {
          1440: {
            slidesPerView: 5
          },
          1350: {
            slidesPerView: 5
          },
          1024: {
            slidesPerView: 5
          },
          770: {
            slidesPerView: 3
          },
          414: {
            slidesPerView: 3
          },
          375: {
            slidesPerView: 1
          }
        }
  });
});



// cnt4
$(document).ready(function () {
    // 1) 스크롤 이벤트 
    $(window).on('scroll', function () {
      // 2) 스크롤바의 수직이동거리 변수
      const scrollY = $(this).scrollTop() + $(this).height() * 2/3; //스크롤바를 빠르게 움직이는 사용자를 위해 자신의 위치 보다 먼저 보여지기 시작한다. 값은 요소의 크기에 따라 다르다
      console.log(scrollY);
  
      // 스크롤바가 움직인 거리와 본문의 위치가 가까워질 경우만 .cnt.fade를 추가함
      $('.fade').each(function (idx) {
        if (scrollY > $(this).offset().top) {
          $(this).addClass('on');
        } else { //반복적인 효과가 필요한 경우만 사용하기
          $(this).removeClass('on');
        }
      });
    });
    
    $(window).trigger('scroll');
});

// cnt5
$(document).ready(function () {
  // 웹페이지를 열었을때
  $('#cnt5 .main').show();
  $('#cnt5 .side').hide();

  $('#cnt5 .main').on('click', function () {
  $('#cnt5 .main').hide();
  $('#cnt5 .side').show();  
    return false;
  });
  $('#cnt5 .side').on('click', function () {
  $('#cnt5 .main').show();
  $('#cnt5 .side').hide();  
    return false;
  });


  // 모달제어
   /* 
    모달 열기 버튼 클릭
    1) 변수선언 : 열기버튼, 열려질 상세 모달 내용, 닫기버튼, 포커스를 처음가질 요소, 포커스를 마지막에 가질 요소
    2) 현재의 스크롤 그대로 유지 : #wrap 높이값 -> html, body에게 적용
    3) 열려진 모달을 제외한 나머지에 스크린리더 접근 제한: aria-hidden, inert
    4) dim 동적생성후 모달 보여지게 처리 -> 첫번째 요소에 포커스 강제 이동
    5) 닫기 버튼을 누르기 전까지 포커스 제어 -> 키보드 trapping
  
    모달 닫기 버튼 클릭(Esc 키보드를 누르는 경우, dim 클릭하는 경우)
    1) html, body에게 준 높이를 제거 -> removeAttr('style')
    2) dim 보이지 않게 숨기고 -> 삭제
    3-1) 열려진 모달도 숨기기
    3-2) 열려진 모달을 제외한 나머지에 스크린리더 접근 제한: aria-hidden, inert
    4) 모달열기 버튼에 포커스 강제 이동
    */
    $('.md_cnt').hide();
    $('.md_open_btn').on('click', function () {
      // 1) 변수선언 : 열기버튼, 열려질 상세 모달 내용, 닫기버튼, 포커스를 처음가질 요소, 포커스를 마지막에 가질 요소
       $('.md_cnt').show();
       const $openBtn = $(this);
       const $mdVideo = $($(this).attr('data-href'));
       // const $mdVideo = $($(this).data('href'));
       console.log($mdVideo, typeof $mdVideo);
       const $closeBtn = $mdVideo.find('.btn_close_modal');
       const $first = $mdVideo.find('[data-link="first"]');
       // const $first = $mdVideo.find('.first');
       const $last = $mdVideo.find('[data-link="last"]'); //$last 대신  $closeBtn으로 처리 가능함(2개는 동일함)
   
       // 2) 현재의 스크롤 그대로 유지 : #wrap 높이값 -> html, body에게 적용
       const wrapHei = $('#wrap').outerHeight();
       $('html, body').css({height: wrapHei, overflow: 'hidden'});
   
       // 3) 열려진 모달을 제외한 나머지에 스크린리더 접근 제한: aria-hidden, inert
       $mdVideo.siblings().attr({'aria-hidden': true, inert: ''});
   
       // 4) dim 동적생성후 모달 보여지게 처리 -> 첫번째 요소에 포커스 강제 이동
       $mdVideo.before('<div id="dim"></div>');
       const $dim = $('#dim');
       $dim.stop().fadeIn().next().css('visibility', 'visible').find('[data-link="first"]').focus();
   
       // 5) 닫기 버튼을 누르기 전까지 포커스 제어 -> 키보드 trapping
       // $first에서 shift+tab => $last강제이동
       $first.on('keydown', function (e) {
         console.log(e.keyCode); //tab => 9
         if (e.shiftKey && e.keyCode === 9) {
           e.preventDefault();  //shift+tab을 누르면 이전 요소에 포커스가 이동해야 하는데 기본 기능을 차단하기 위해 추가
           $last.focus();
         }
       });
       // $last에서 shift(X)+tab => $first 강제이동
       $last.on('keydown', function (e) {
         if (!e.shiftKey && e.keyCode === 9) {
           e.preventDefault();
           $first.focus();
         }
       });
   
       $closeBtn.on('click', function () {
         $('.md_cnt').hide();
         // 1) html, body에게 준 높이를 제거 -> removeAttr('style')
         $('html, body').removeAttr('style');
 
         // 2) dim 보이지 않게 숨기고 -> 삭제
         $dim.stop().fadeOut(function () {
           $(this).remove();
         });
   
         // 3-1) 열려진 모달도 숨기기
         // 3-2) 열려진 모달을 제외한 나머지에 스크린리더 접근 제한: aria-hidden, inert
         $mdVideo.css('visibility', 'hidden').siblings().removeAttr('aria-hidden inert');
   
         // 5) 모달열기 버튼에 포커스 강제 이동
         $openBtn.focus();
      });
 
      // esc, #dim 클릭시 닫기버튼과 동일하게 처리
      $dim.on('click', function () {
          $closeBtn.trigger('click'); // dim을 클릭하거든 닫기버튼을 강제로 클릭 해줘
      });
      $(window).on('keydown', function (e) {
          console.log(e.keyCode); // esc=>27
          // if(e.keyCode === 27) $closeBtn.trigger('click');
          if(e.keyCode === 27) $closeBtn.click(); //trigger()사용하거나, click()강제로 사용
      });
    });

});

