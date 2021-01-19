/**
 * Full page
 */
(function () {
  'use strict';
  let fullScroll = function (params) {
    let main = document.getElementById(params.mainElement);
    let sections = main.getElementsByTagName('section');

    this.defaults = {
      container: main,
      sections: sections,
      animateTime: params.animateTime || 0.7,
      animateFunction: params.animateFunction || 'ease',
      maxPosition: sections.length - 1,
      currentPosition: 0,
      displayDots: typeof params.displayDots != 'undefined' ? params.displayDots : true,
      dotsPosition: params.dotsPosition || 'left'
    };
    this.init();
  };

  fullScroll.prototype.init = function () {
    this.buildPublicFunctions()
      .buildSections()
      .buildDots()
      .addEvents();

    let anchor = location.hash.replace('#', '').split('/')[0];
    location.hash = 0;
    this.changeCurrentPosition(anchor);
    this.registerIeTags();
  };

  fullScroll.prototype.buildSections = function () {
    let sections = this.defaults.sections;
    for (let i = 0; i < sections.length; i++) {
      sections[i].setAttribute('data-index', i);
    }
    return this;
  };

  fullScroll.prototype.buildDots = function () {
    this.ul = document.createElement('ul');

    this.ul.className = this.updateClass(1, 'dots', this.ul.className);
    this.ul.className = this.updateClass(1, this.defaults.dotsPosition == 'right' ? 'dots-right' : 'dots-left', this.ul.className);

    let _self = this;
    let sections = this.defaults.sections;

    for (let i = 0; i < sections.length; i++) {
      let li = document.createElement('li');
      let a = document.createElement('a');

      a.setAttribute('href', '#' + i);
      li.appendChild(a);
      _self.ul.appendChild(li);
    }

    this.ul.childNodes[0].firstChild.className = this.updateClass(1, 'active', this.ul.childNodes[0].firstChild.className);

    if (this.defaults.displayDots) {
      document.body.appendChild(this.ul);
    }

    return this;
  };

  fullScroll.prototype.addEvents = function () {

    if (document.addEventListener) {
      document.addEventListener('mousewheel', this.mouseWheelAndKey, false);
      document.addEventListener('wheel', this.mouseWheelAndKey, false);
      document.addEventListener('keyup', this.mouseWheelAndKey, false);
      document.addEventListener('touchstart', this.touchStart, false);
      document.addEventListener('touchend', this.touchEnd, false);
      window.addEventListener('hashchange', this.hashChange, false);

      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        if (!('ontouchstart' in window)) {
          document.body.style = 'overflow: scroll;';
          document.documentElement.style = 'overflow: scroll;';
        }
      }

    } else {
      document.attachEvent('onmousewheel', this.mouseWheelAndKey, false);
      document.attachEvent('onkeyup', this.mouseWheelAndKey, false);
    }

    return this;
  };

  fullScroll.prototype.buildPublicFunctions = function () {
    let mTouchStart = 0;
    let mTouchEnd = 0;
    let _self = this;

    this.mouseWheelAndKey = function (event) {
      if (event.deltaY > 0 || event.keyCode == 40) {
        _self.defaults.currentPosition++;
        _self.changeCurrentPosition(_self.defaults.currentPosition);
      } else if (event.deltaY < 0 || event.keyCode == 38) {
        _self.defaults.currentPosition--;
        _self.changeCurrentPosition(_self.defaults.currentPosition);
      }
      _self.removeEvents();
    };

    this.touchStart = function (event) {
      mTouchStart = parseInt(event.changedTouches[0].clientY);
      mTouchEnd = 0;
    };

    this.touchEnd = function (event) {
      mTouchEnd = parseInt(event.changedTouches[0].clientY);
      if (mTouchEnd - mTouchStart > 100 || mTouchStart - mTouchEnd > 100) {
        if (mTouchEnd > mTouchStart) {
          _self.defaults.currentPosition--;
        } else {
          _self.defaults.currentPosition++;
        }
        _self.changeCurrentPosition(_self.defaults.currentPosition);
      }
    };

    this.hashChange = function (event) {
      if (location) {
        let anchor = location.hash.replace('#', '').split('/')[0];
        if (anchor !== '') {
          if (anchor < 0) {
            _self.changeCurrentPosition(0);
          } else if (anchor > _self.defaults.maxPosition) {
            _self.changeCurrentPosition(_self.defaults.maxPosition);
          } else {
            _self.defaults.currentPosition = anchor;
            _self.animateScroll();
          }
        }
      }
    };

    this.removeEvents = function () {
      if (document.addEventListener) {
        document.removeEventListener('mousewheel', this.mouseWheelAndKey, false);
        document.removeEventListener('wheel', this.mouseWheelAndKey, false);
        document.removeEventListener('keyup', this.mouseWheelAndKey, false);
        document.removeEventListener('touchstart', this.touchStart, false);
        document.removeEventListener('touchend', this.touchEnd, false);

      } else {
        document.detachEvent('onmousewheel', this.mouseWheelAndKey, false);
        document.detachEvent('onkeyup', this.mouseWheelAndKey, false);
      }

      setTimeout(function () {
        _self.addEvents();
      }, 600);
    };

    this.animateScroll = function () {
      let animateTime = this.defaults.animateTime;
      let animateFunction = this.defaults.animateFunction;
      let position = this.defaults.currentPosition * 100;

      this.defaults.container.style.webkitTransform = 'translateY(-' + position + '%)';
      this.defaults.container.style.mozTransform = 'translateY(-' + position + '%)';
      this.defaults.container.style.msTransform = 'translateY(-' + position + '%)';
      this.defaults.container.style.transform = 'translateY(-' + position + '%)';
      this.defaults.container.style.webkitTransition = 'all ' + animateTime + 's ' + animateFunction;
      this.defaults.container.style.mozTransition = 'all ' + animateTime + 's ' + animateFunction;
      this.defaults.container.style.msTransition = 'all ' + animateTime + 's ' + animateFunction;
      this.defaults.container.style.transition = 'all ' + animateTime + 's ' + animateFunction;

      for (let i = 0; i < this.ul.childNodes.length; i++) {
        this.ul.childNodes[i].firstChild.className = this.updateClass(2, 'active', this.ul.childNodes[i].firstChild.className);
        if (i == this.defaults.currentPosition) {
          this.ul.childNodes[i].firstChild.className = this.updateClass(1, 'active', this.ul.childNodes[i].firstChild.className);
        }
      }
    };

    this.changeCurrentPosition = function (position) {
      if (position !== '') {
        _self.defaults.currentPosition = position;
        location.hash = _self.defaults.currentPosition;
      }
    };

    this.registerIeTags = function () {
      document.createElement('section');
    };

    this.updateClass = function (type, newClass, currentClass) {
      if (type == 1) {
        return currentClass += ' ' + newClass;
      } else if (type == 2) {
        return currentClass.replace(newClass, '');
      }
    };

    return this;
  };
  window.fullScroll = fullScroll;
})();
