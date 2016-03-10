// TODO: JUMP INS LEERE (OHNE ANKER)

(function initialize($) {
  const defaultTarget = $('html, body');

  $.fn.kcJumpSmooth = function kcJumpSmooth(
    {target, direction, offset,
      normalize, normalizeOffset, history} = {}) {
    target = target || defaultTarget;
    direction = direction || 'Top';
    offset = offset || 0;
    normalize = normalize || false;
    normalizeOffset = normalizeOffset || 0;
    history = history || false;

    if(target.length !== 1 && target !== defaultTarget)
      return console.error('Target must be unique');
    let container = target.children('.kc-container');
    let checked = 0, timeout;
    let clicked = false;

    if(container.length !== 1)
      container = false;
    if(container) {
      $(window)
        .on('resize.kcJumpSmooth', resizeDone);
      sizing();
    }

    if(history) {
      $(window)
        .on('popstate.kcJumpSmooth', ()=> {
          const hash = $(`${location.hash}`);

          if(!clicked && hash.hasClass('kc-smooth') && isInScope.call(this))
            scroll(hash, false);
        });
    }

    this.on('click.kcJumpSmooth', function clickJumpSmooth(event) {
      event.preventDefault();
      clicked = true;
      scroll($(this).attr('href'), true);
    });

    $(fixAnchorOffset);

    function scroll(hash, entry) {
      const prevHash = $(hash);
      const scrollAttr = {};
      const scrollValue = prevHash[0][`offset${direction}`] - offset;

      if(container) checked = prevHash.index();

      // Nur wenn Wrapper dabei ist
      if(history && normalize && !target.is(defaultTarget) && !entry) {
        defaultTarget.clearQueue()
          .animate(
            { scrollTop: `${normalize[0].offsetTop - normalizeOffset}px` });
      }

      if(history && entry) {
        prevHash.attr('id', '');
        window.location.hash = hash;
        prevHash.attr('id', hash.replace('#', ''));
      }
      scrollAttr[`scroll${direction}`] = `${scrollValue}px`;
      target.clearQueue().animate(scrollAttr, ()=> {
        clicked = false;
      });
    }

    function isInScope() {
      for(const elem of this) {
        if($(elem).attr('href') === location.hash)
          return true;
      }
      return false;
    }

    function resizeDone() {
      clearTimeout(timeout);
      timeout = setTimeout(sizing, 200);
    }

    function sizing() {
      const sliderWidth = target.outerWidth();
      const containerElements = container.children('.kc-element').length;
      const containerWidth = sliderWidth * containerElements;

      container.outerWidth(containerWidth);
      container.children('.kc-element').outerWidth(sliderWidth);
      target.scrollLeft(checked * sliderWidth);
    }

    function fixAnchorOffset() {
      if($(`${location.hash} `).length)
        $(`a[href="${location.hash}"]`).trigger('popstate.kcJumpSmooth');
    }
  };
})(jQuery);

export {};
