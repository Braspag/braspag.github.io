$('div.highlighter-rouge').prepend('<a class="fa expand-btn" title="{% t global.toggle_code %}"><i class="fa fa-expand" aria-hidden=true></i></a>');

$('div.highlighter-rouge').each(function () {
  if (!$(this).parent().hasClass('language-group')) {
    $(this).first().next('div.highlighter-rouge').andSelf()
      .wrapAll('<div class="code-fullscreen"><div class="language-group"></div></div>');
  }
});

$('.content-container:not(.no-dark-box) div.highlighter-rouge').each(function () {
  const height = $(this).outerHeight();

  $(this).parent().parent().next('table')
    .wrapAll(`<div class="table-wrap" style="min-height:${height}px;"></div> `);
});

$('.hide-btn').click(() => {
  $('.content-container').toggleClass('no-dark-box');
  $('.dark-box').toggle();

  $('.overlay').removeClass('opened');
  $('.code-fullscreen').removeClass('opened');
});

$('.expand-btn').click(function () {
  $('.overlay').toggleClass('opened');
  $(this).parent().parent().parent()
    .toggleClass('opened');
  $(this).children('i.fa').toggleClass('fa-compress');
});

$('.language-group').prepend(`<div class="language-buttons">${langs}</div>`);
