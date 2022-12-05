var ghostAPI = new GhostContentAPI({
  host: config['content-api-host'],
  key: config['content-api-key'],
  version: 'canary',
  ghostPath: 'bluedot',
});


$(document).ready(function() {

  'use strict';

  $('.dingding-shop-ajax').each(function(index, el) {
    // console.log(el);
    $(this).on('click', function(event) {
      event.preventDefault();

      $(this).addClass('active');
      $('.dingding-content').removeClass('active');
      var slug = $(this).data('slug');
      $('.n-archive__list').empty();

      ghostAPI.products
        .browse({limit: '10', include: 'tags', filter: `tag:${slug}`})
        .then((data) => {
          console.log(data);
          for (const item of data) {
            var feature_image = item.feature_image ? `<img class="c-product-card__image" src="${item.feature_image}" alt="${item.title}">` : '';
            var price_info = {
              guest: {
                label: '무료 회원 할인가',
                price: '',
              },
              member: {
                has: false,
                label: '유료 회원 할인가',
                price: ''
              }
            };

            if (mmb.active && mmb.paid) {
               if (item.payment.have_price_sale) {
                price_info.member.has = true;
                price_info.guest.price = item.payment.price_sale == 0 ? '무료' : new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(item.payment.price_sale);

                if (item.payment.have_price_original) {
                  price_info.member.price = item.payment.price_original == 0 ? '무료' : new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(item.payment.price_original);
                } else {
                  price_info.member.price = item.payment.price == 0 ? '무료' : new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(item.payment.price);
                }
               } else {
                price_info.guest.label = '가격';
                price_info.guest.price = item.payment.price_original == 0 ? '무료' : new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(item.payment.price_original);

                if (item.payment.have_price_original) {
                  price_info.member.has = true;
                  price_info.member.label = '무료 회원 할인가';
                  price_info.member.price = item.payment.price == 0 ? '무료' : new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(item.payment.price);
                }
               }
            } else {
              price_info.guest.price = item.payment.price == 0 ? '무료' : new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(item.payment.price);
              if (item.payment.have_price_sale) {
                price_info.member.has = true;
                price_info.member.price = item.payment.price_sale == 0 ? '무료' : new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(item.payment.price_sale);
              }
            }

            var payment = '<div class="n-product-card__meta">';
            payment += `<div class="n-product-card__price">
          <div class="label">${price_info.guest.label}</div>
          <div class="price">${price_info.guest.price}</div>
        </div>`;
            if (price_info.member.has) {
              payment += `<div class="n-product-card__price">
              <div class="label">${price_info.member.label}</div>
              <div class="price">${price_info.member.price}</div>
        </div>`;
            }
            payment += '</div>';

            $('.n-archive__list').append(
`<article class="n-product-card-wrap animate__animated animate__fadeInUp">
<div class="n-product-card">
  <div class="n-product-card__media">
    <a class="n-product-card__image-wrap" href="${item.url}">${feature_image}</a>
  </div>
  <div class="n-product-card__content">
    <div class="n-product-card__type c-product-card__type--${item.payment.type}">${item.payment.type_text}</div>
    <div class="n-product-card__title-wrap">
      <h2 class="n-product-card__title">
        <a class="n-product-card__title-link" href="${item.url}">${item.title}</a>
      </h2>
    </div>
    ${payment}
  </div>
</div>
</article>`);
          }
        })
      .catch((err) => {
        console.error(err);
      });
    });
  });

  $('.dingding-post-ajax').each(function(index, el) {
    // console.log(el);
    $(this).on('click', function(event) {
      event.preventDefault();

      $(this).addClass('active');
      $('.dingding-shop-ajax').removeClass('active');
      var slug = $(this).data('slug');
      $('.n-archive__list').empty();

      ghostAPI.posts
        .browse({limit: '10', include: 'tags', filter: `tag:${slug}`})
        .then((data) => {
          // console.log(data);
          for (const item of data) {
            var excerpt = item.excerpt ? item.excerpt : '';
            var feature_image = item.feature_image ? `<img class="n-post-card__image lazyload" src="${item.feature_image}" alt="${item.title}">` : '';
            var primary_tag = item.primary_tag ? `<div class="n-post-card__main-tag">${item.primary_tag.name}</div>` : '';

            $('.n-archive__list').append(
`<article class="n-post-card js-post-card-wrap animate__animated animate__fadeInUp">
  <div class="n-post-card__media">
    <a class="n-post-card__media--link" href="${item.url}">${feature_image}</a>
  </div>
  <div class="n-post-card__content">
    <div class="n-post-card__text">
      <h1 class="n-post-card__title">
        <a href="${item.url}">${item.title}</a>
      </h1>
      <p class="n-post-card__excerpt">${excerpt}</p>
    </div>
    <div class="n-post-card__meta">
      <div class="n-post-card__tags">${primary_tag}</div>
      <div class="n-post-card__bookmark">
        <a href="#" class="n-post-card__bookmark--icon please-signin">
          <svg class="status-none" width="17" height="25" viewBox="0 0 17 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.2747 0H0.725814C0.533316 0 0.348702 0.0771656 0.212586 0.214521C0.0764693 0.351877 7.45984e-08 0.538172 7.45984e-08 0.732422V24.2676C-6.50164e-05 24.4125 0.0424678 24.5542 0.122217 24.6747C0.201966 24.7952 0.315347 24.8891 0.448012 24.9446C0.580678 25 0.726666 25.0145 0.867503 24.9862C1.00834 24.958 1.1377 24.8881 1.23921 24.7856L8.50024 17.458L15.7613 24.7856C15.8628 24.8881 15.9921 24.958 16.133 24.9862C16.2738 25.0145 16.4198 25 16.5525 24.9446C16.6851 24.8891 16.7985 24.7952 16.8783 24.6747C16.958 24.5542 17.0006 24.4125 17.0005 24.2676V0.732422C17.0005 0.538172 16.924 0.351877 16.7879 0.214521C16.6518 0.0771656 16.4672 0 16.2747 0V0ZM8.50024 15.6899C8.30781 15.6901 8.12332 15.7674 7.98733 15.9048L1.45163 22.4995V1.46484H15.5489V22.4995L9.01363 15.9048C8.94624 15.8367 8.86621 15.7827 8.77812 15.7458C8.69003 15.7089 8.59561 15.69 8.50024 15.6899Z" fill="#CDCDCD"/>
          </svg>
        </a>
      </div>
    </div>
  </div>
</article>`);
          }
        })
      .catch((err) => {
        console.error(err);
      });
    });
  });

  // =====================
  // Koenig Gallery
  // =====================
  var gallery_images = document.querySelectorAll('.kg-gallery-image img');

  gallery_images.forEach(function (image) {
    var container = image.closest('.kg-gallery-image');
    var width = image.attributes.width.value;
    var height = image.attributes.height.value;
    var ratio = width / height;
    container.style.flex = ratio + ' 1 0%';
  });

  // =====================
  // Decode HTML entities returned by Ghost translations
  // Input: Plus d&#x27;articles
  // Output: Plus d'articles
  // =====================

  function decoding_translation_chars(string) {
    return $('<textarea/>').html(string).text();
  }

  // =====================
  // Headroom
  // =====================

  $('.js-header').headroom({
    tolerance: {
      down : 10,
      up : 20
    },
    classes: {
      initial:  'js-header--headroom',
      top:      'js-header--top',
      notTop:   'js-header--not-top',
      pinned:   'js-header--pinned',
      unpinned: 'js-header--unpinned'
    }
  });

  // =====================
  // Navigation
  // =====================

  $('.js-nav-toggle').click(function(e) {
    e.preventDefault();
    $('.c-nav-wrap').toggleClass('is-active');
    $(this).toggleClass('c-nav-toggle--close');
  });

  // =====================
  // Responsive videos
  // =====================

  $('.c-content').fitVids({
    'customSelector': [ 'iframe[src*="ted.com"]'          ,
                        'iframe[src*="player.twitch.tv"]' ,
                        'iframe[src*="dailymotion.com"]'  ,
                        'iframe[src*="facebook.com"]'
                      ]
  });

  // =====================
  // Images zoom
  // =====================

  $('.c-post img').attr('data-action', 'zoom');

  // If the image is inside a link, remove zoom
  $('.c-post a img').removeAttr('data-action');

  // =====================
  // Clipboard URL Copy
  // =====================

  var clipboard = new ClipboardJS('.js-share__link--clipboard');

  clipboard.on('success', function(e) {
    var element = $(e.trigger);

    element.addClass('tooltipped tooltipped-s');
    element.attr('aria-label', clipboard_copied_text);

    element.mouseleave(function() {
      $(this).removeAttr('aria-label');
      $(this).removeClass('tooltipped tooltipped-s');
    });
  });

  // =====================
  // Search
  // =====================

  var search_field = $('.js-search-input'),
      search_results = $('.js-search-results'),
      toggle_search = $('.js-search-toggle'),
      search_result_template = "\
      <a href={{link}} class='c-search-result'>\
        <div class='c-search-result__content'>\
          <h3 class='c-search-result__title'>{{title}}</h3>\
          <time class='c-search-result__date'>{{pubDate}}</time>\
        </div>\
        <div class='c-search-result__media'>\
          <div class='c-search-result__image is-inview' style='background-image: url({{featureImage}})'></div>\
        </div>\
      </a>";

  toggle_search.click(function(e) {
    e.preventDefault();
    $('.js-search').addClass('is-active');

    // If off-canvas is active, just disable it
    $('.js-off-canvas-container').removeClass('is-active');

    setTimeout(function() {
      search_field.focus();
    }, 500);
  });

  $('.c-search, .js-search-close, .js-search-close .icon').on('click keyup', function(event) {
    if (event.target == this || event.target.className == 'js-search-close' || event.target.className == 'icon' || event.keyCode == 27) {
      $('.c-search').removeClass('is-active');
    }
  });

  search_field.ghostHunter({
    results: search_results,
    onKeyUp         : true,
    result_template : search_result_template,
    zeroResultsInfo : false,
    displaySearchInfo: false,
    before: function() {
      search_results.fadeIn();
    }
  });

  // =====================
  // Ajax Load More
  // =====================

  var pagination_next_url = $('link[rel=next]').attr('href'),
    $load_posts_button = $('.js-load-posts');

  $load_posts_button.click(function(e) {
    e.preventDefault();

    var request_next_link =
      pagination_next_url.split(/page/)[0] +
      'page/' +
      pagination_next_page_number +
      '/';

    $.ajax({
      url: request_next_link,
      beforeSend: function() {
        $load_posts_button.text(decoding_translation_chars(pagination_loading_text));
        $load_posts_button.addClass('c-btn--loading');
      }
    }).done(function(data) {
      var posts = $('.js-post-card-wrap', data);

      $('.js-grid').append(posts);

      $load_posts_button.text(decoding_translation_chars(pagination_more_posts_text));
      $load_posts_button.removeClass('c-btn--loading');

      pagination_next_page_number++;

      // If you are on the last pagination page, hide the load more button
      if (pagination_next_page_number > pagination_available_pages_number) {
        $load_posts_button.addClass('c-btn--disabled').attr('disabled', true);
      }
    });
  });


  var readLaterPosts = [];

  if (typeof Cookies.get('dingding-read-later') !== "undefined") {
		readLaterPosts = JSON.parse(Cookies.get('dingding-read-later'));
	}

  readLaterPosts = readLater($('body'), readLaterPosts);

  function removeValue(arr) {
    var what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax= arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
  }

  function readLater(content, readLaterPosts){

    // $('.read-later').each(function(index, el){
    //   $(this).on('click', function(event) {
    //     event.preventDefault();
    //     var id = $(this).attr('data-id');

    //     if ($(this).hasClass('active')) {
    //       removeValue(readLaterPosts, id);
    //     }else{
    //       readLaterPosts.push(id);
    //     };

    //     $('.read-later[data-id="'+ id +'"]').each(function(index, el) {
    //       $(this).toggleClass('active');
    //     });

    //     Cookies.set('dingding-read-later', readLaterPosts, { expires: 365 });

    //     console.log(readLaterPosts);
    //   });
    // });

		if (typeof Cookies.get('dingding-read-later') !== "undefined") {
			$.each(readLaterPosts, function(index, val) {
				$('.read-later[data-id="'+ val +'"]').addClass('active');
			});
			bookmarks(readLaterPosts);
		}

		$(content).find('.read-later').each(function(index, el) {
			$(this).on('click', function(event) {
				event.preventDefault();
				var id = $(this).attr('data-id');
				if ($(this).hasClass('active')) {
					removeValue(readLaterPosts, id);
				}else{
					readLaterPosts.push(id);
				};
				$('.read-later[data-id="'+ id +'"]').each(function(index, el) {
					$(this).toggleClass('active');
				});
				// $('header .btns a .counter').addClass('shake');
				// setTimeout(function() {
				// 	$('header .btns a .counter').removeClass('shake');
				// }, 300);
				Cookies.set('dingding-read-later', readLaterPosts, { expires: 365 });
				bookmarks(readLaterPosts);
			});
		});

		return readLaterPosts;

	}

	function bookmarks(readLaterPosts){
    $.each(readLaterPosts, function(index, val){

    });

		// $('.bookmark-container').empty();
		// if (readLaterPosts.length) {

		// 	var filter = readLaterPosts.toString();
		// 	filter = "id:["+filter+"]";

    //         ghostAPI.posts
    //             .browse({limit: 'all', filter: filter, include: 'tags'})
    //             .then((results) => {

    //                 $('.bookmark-container').empty();

    //                 var tags = [];
    //                 $.each(results, function(index, val) {
    //                     if (val.primary_tag) {
    //                         if ($.inArray(val.primary_tag.name, tags) === -1) {
    //                             tags.push(val.primary_tag.name);
    //                         };
    //                     }else{
    //                         if ($.inArray('Other', tags) === -1) {
    //                             tags.push('Other');
    //                         };
    //                     };
    //                 });

    //                 tags.sort();

    //                 $.each(tags, function(index, val) {
    //                     var tag = val;
    //                     if (val == 'Other') {
    //                         tag = $('.bookmark-container').attr('data-other');
    //                     };
    //                     $('.bookmark-container').append('<h5>'+ tag +'</h5><ul data-tag="'+ val +'" class="list-box"></ul>');
		// 			});

    //                 $.each(results, function(index, val) {
    //                     var dateSplit = val.published_at.split('T');
    //                     dateSplit = dateSplit[0].split('-');
    //                     var month = monthNames[dateSplit[1]-1];
    //                     var date = moment(dateSplit[2]+'-'+month+'-'+dateSplit[1], "DD-MM-YYYY").format('DD MMM YYYY');
    //                     if (val.primary_tag) {
    //                         $('.bookmark-container ul[data-tag="'+ val.primary_tag.name +'"]').append('<li><time>'+ date +'</time><a href="#" class="read-later active" data-id="'+ val.id +'"></a><a href="'+ val.slug +'">'+ val.title +'</a></li>');
    //                     }else{
    //                         $('.bookmark-container ul[data-tag="Other"]').append('<li><a href="#" class="read-later active" data-id="'+ val.id +'"></a><time>'+ date +'</time><a href="'+ val.slug +'">'+ val.title +'</a></li>');
    //                     };
    //                 });

    //                 $('.bookmark-container').find('.read-later').each(function(index, el) {
    //                     $(this).on('click', function(event) {
    //                         event.preventDefault();
    //                         var id = $(this).attr('data-id');
    //                         if ($(this).hasClass('active')) {
    //                             removeValue(readLaterPosts, id);
    //                         }else{
    //                             readLaterPosts.push(id);
    //                         };
    //                         $('.read-later[data-id="'+ id +'"]').each(function(index, el) {
    //                             $(this).toggleClass('active');
    //                         });
    //                         Cookies.set('zvikov-read-later', readLaterPosts, { expires: 365 });
    //                         bookmarks(readLaterPosts);
    //                     });
    //                 });

    //                 if (results) {
    //                     $('header .counter').removeClass('hidden').text(results.length);
    //                 }else{
    //                     $('header .counter').addClass('hidden');
    //                     $('.bookmark-container').append('<p class="no-bookmarks"></p>');
    //                     $('.no-bookmarks').html(noBookmarksMessage)
    //                 };
		// 	})
		// 	.catch((err) => {
		// 		console.error(err);
		// 	});
		// }else{
		// 	$('header .counter').addClass('hidden');
    //         $('.bookmark-container').append('<p class="no-bookmarks"></p>');
    //         $('.no-bookmarks').html(noBookmarksMessage)
		// };

	}

  $(document).on('click', '.please-signin', function(event) {
    event.preventDefault();
    alert('로그인이 필요한 기능입니다.');
    location.href="/signin";
    return false;
  });
});

const goodsSwiper = new Swiper('.goods__swiper', {
  slidesPerView: 1,
  spaceBetween: 30,
  pagination: {
    el: '.goods__swiper .swiper-pagination',
    type: 'fraction',
    enabled: true
  },
  navigation: {
    nextEl: '.goods__swiper .swiper-button-next',
    prevEl: '.goods__swiper .swiper-button-prev',
    enabled: true
  },
});

const booksSwiper = new Swiper('.n-books__swiper', {
  slidesPerView: 1,
  spaceBetween: 26,
  pagination: {
    el: '.n-books__swiper .swiper-pagination',
    enabled: true
  },
  // Navigation arrows
  navigation: {
    nextEl: '.n-books__list .swiper-button-next',
    prevEl: '.n-books__list .swiper-button-prev',
    enabled: false
  },
  slidesPerView: 2,
  grid: {
    rows: 2
  },

  // Responsive breakpoints
  breakpoints: {
    // when window width is >= 320px
    // 1024: {
    //   slidesPerView: 4,
    //   spaceBetween: 26,
    //   grid: {
    //     rows: 1
    //   },
    //   navigation: {
    //     enabled: true
    //   },
    //   pagination: {
    //     enabled: false
    //   }
    // },
    1024: {
      slidesPerView: 6,
      spaceBetween: 32,
      grid: {
        rows: 1
      },
      navigation: {
        enabled: true
      },
      pagination: {
        enabled: false
      }
    }
  }
});

const shop_hero = new Swiper('.c-shop-featured__carousel--swiper', {
  // Navigation arrows
  navigation: {
    nextEl: '.c-shop-featured__carousel .swiper-button-next',
    prevEl: '.c-shop-featured__carousel .swiper-button-prev',
  },

  slidesPerView: 1,
  spaceBetween: 40,
});

// history.scrollRestoration = "manual"

