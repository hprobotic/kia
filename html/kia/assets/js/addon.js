"function" !== typeof Object.create && (Object.create = function(f) {
  function g() {}
  g.prototype = f;
  return new g
});
(function(f, g, k) {
  var l = {
    init: function(a, b) {
      this.$elem = f(b);
      this.options = f.extend({}, f.fn.owlCarousel.options, this.$elem.data(), a);
      this.userOptions = a;
      this.loadContent()
    },
    loadContent: function() {
      function a(a) {
        var d, e = "";
        if ("function" === typeof b.options.jsonSuccess) b.options.jsonSuccess.apply(this, [a]);
        else {
          for (d in a.owl) a.owl.hasOwnProperty(d) && (e += a.owl[d].item);
          b.$elem.html(e)
        }
        b.logIn()
      }
      var b = this,
        e;
      "function" === typeof b.options.beforeInit && b.options.beforeInit.apply(this, [b.$elem]);
      "string" === typeof b.options.jsonPath ?
        (e = b.options.jsonPath, f.getJSON(e, a)) : b.logIn()
    },
    logIn: function() {
      this.$elem.data("owl-originalStyles", this.$elem.attr("style"));
      this.$elem.data("owl-originalClasses", this.$elem.attr("class"));
      this.$elem.css({
        opacity: 0
      });
      this.orignalItems = this.options.items;
      this.checkBrowser();
      this.wrapperWidth = 0;
      this.checkVisible = null;
      this.setVars()
    },
    setVars: function() {
      if (0 === this.$elem.children().length) return !1;
      this.baseClass();
      this.eventTypes();
      this.$userItems = this.$elem.children();
      this.itemsAmount = this.$userItems.length;
      this.wrapItems();
      this.$owlItems = this.$elem.find(".owl-item");
      this.$owlWrapper = this.$elem.find(".owl-wrapper");
      this.playDirection = "next";
      this.prevItem = 0;
      this.prevArr = [0];
      this.currentItem = 0;
      this.customEvents();
      this.onStartup()
    },
    onStartup: function() {
      this.updateItems();
      this.calculateAll();
      this.buildControls();
      this.updateControls();
      this.response();
      this.moveEvents();
      this.stopOnHover();
      this.owlStatus();
      !1 !== this.options.transitionStyle && this.transitionTypes(this.options.transitionStyle);
      !0 === this.options.autoPlay &&
        (this.options.autoPlay = 5E3);
      this.play();
      this.$elem.find(".owl-wrapper").css("display", "block");
      this.$elem.is(":visible") ? this.$elem.css("opacity", 1) : this.watchVisibility();
      this.onstartup = !1;
      this.eachMoveUpdate();
      "function" === typeof this.options.afterInit && this.options.afterInit.apply(this, [this.$elem])
    },
    eachMoveUpdate: function() {
      !0 === this.options.lazyLoad && this.lazyLoad();
      !0 === this.options.autoHeight && this.autoHeight();
      this.onVisibleItems();
      "function" === typeof this.options.afterAction && this.options.afterAction.apply(this, [this.$elem])
    },
    updateVars: function() {
      "function" === typeof this.options.beforeUpdate && this.options.beforeUpdate.apply(this, [this.$elem]);
      this.watchVisibility();
      this.updateItems();
      this.calculateAll();
      this.updatePosition();
      this.updateControls();
      this.eachMoveUpdate();
      "function" === typeof this.options.afterUpdate && this.options.afterUpdate.apply(this, [this.$elem])
    },
    reload: function() {
      var a = this;
      g.setTimeout(function() {
        a.updateVars()
      }, 0)
    },
    watchVisibility: function() {
      var a = this;
      if (!1 === a.$elem.is(":visible")) a.$elem.css({
          opacity: 0
        }),
        g.clearInterval(a.autoPlayInterval), g.clearInterval(a.checkVisible);
      else return !1;
      a.checkVisible = g.setInterval(function() {
        a.$elem.is(":visible") && (a.reload(), a.$elem.animate({
          opacity: 1
        }, 200), g.clearInterval(a.checkVisible))
      }, 500)
    },
    wrapItems: function() {
      this.$userItems.wrapAll('<div class="owl-wrapper">').wrap('<div class="owl-item"></div>');
      this.$elem.find(".owl-wrapper").wrap('<div class="owl-wrapper-outer">');
      this.wrapperOuter = this.$elem.find(".owl-wrapper-outer");
      this.$elem.css("display", "block")
    },
    baseClass: function() {
      var a = this.$elem.hasClass(this.options.baseClass),
        b = this.$elem.hasClass(this.options.theme);
      a || this.$elem.addClass(this.options.baseClass);
      b || this.$elem.addClass(this.options.theme)
    },
    updateItems: function() {
      var a, b;
      if (!1 === this.options.responsive) return !1;
      if (!0 === this.options.singleItem) return this.options.items = this.orignalItems = 1, this.options.itemsCustom = !1, this.options.itemsDesktop = !1, this.options.itemsDesktopSmall = !1, this.options.itemsTablet = !1, this.options.itemsTabletSmall = !1, this.options.itemsMobile = !1;
      a = f(this.options.responsiveBaseWidth).width();
      a > (this.options.itemsDesktop[0] || this.orignalItems) && (this.options.items = this.orignalItems);
      if (!1 !== this.options.itemsCustom)
        for (this.options.itemsCustom.sort(function(a, b) {
            return a[0] - b[0]
          }), b = 0; b < this.options.itemsCustom.length; b += 1) this.options.itemsCustom[b][0] <= a && (this.options.items = this.options.itemsCustom[b][1]);
      else a <= this.options.itemsDesktop[0] && !1 !== this.options.itemsDesktop && (this.options.items = this.options.itemsDesktop[1]),
        a <= this.options.itemsDesktopSmall[0] && !1 !== this.options.itemsDesktopSmall && (this.options.items = this.options.itemsDesktopSmall[1]), a <= this.options.itemsTablet[0] && !1 !== this.options.itemsTablet && (this.options.items = this.options.itemsTablet[1]), a <= this.options.itemsTabletSmall[0] && !1 !== this.options.itemsTabletSmall && (this.options.items = this.options.itemsTabletSmall[1]), a <= this.options.itemsMobile[0] && !1 !== this.options.itemsMobile && (this.options.items = this.options.itemsMobile[1]);
      this.options.items > this.itemsAmount &&
        !0 === this.options.itemsScaleUp && (this.options.items = this.itemsAmount)
    },
    response: function() {
      var a = this,
        b, e;
      if (!0 !== a.options.responsive) return !1;
      e = f(g).width();
      a.resizer = function() {
        f(g).width() !== e && (!1 !== a.options.autoPlay && g.clearInterval(a.autoPlayInterval), g.clearTimeout(b), b = g.setTimeout(function() {
          e = f(g).width();
          a.updateVars()
        }, a.options.responsiveRefreshRate))
      };
      f(g).resize(a.resizer)
    },
    updatePosition: function() {
      this.jumpTo(this.currentItem);
      !1 !== this.options.autoPlay && this.checkAp()
    },
    appendItemsSizes: function() {
      var a =
        this,
        b = 0,
        e = a.itemsAmount - a.options.items;
      a.$owlItems.each(function(c) {
        var d = f(this);
        d.css({
          width: a.itemWidth
        }).data("owl-item", Number(c));
        if (0 === c % a.options.items || c === e) c > e || (b += 1);
        d.data("owl-roundPages", b)
      })
    },
    appendWrapperSizes: function() {
      this.$owlWrapper.css({
        width: this.$owlItems.length * this.itemWidth * 2,
        left: 0
      });
      this.appendItemsSizes()
    },
    calculateAll: function() {
      this.calculateWidth();
      this.appendWrapperSizes();
      this.loops();
      this.max()
    },
    calculateWidth: function() {
      this.itemWidth = Math.round(this.$elem.width() /
        this.options.items)
    },
    max: function() {
      var a = -1 * (this.itemsAmount * this.itemWidth - this.options.items * this.itemWidth);
      this.options.items > this.itemsAmount ? this.maximumPixels = a = this.maximumItem = 0 : (this.maximumItem = this.itemsAmount - this.options.items, this.maximumPixels = a);
      return a
    },
    min: function() {
      return 0
    },
    loops: function() {
      var a = 0,
        b = 0,
        e, c;
      this.positionsInArray = [0];
      this.pagesInArray = [];
      for (e = 0; e < this.itemsAmount; e += 1) b += this.itemWidth, this.positionsInArray.push(-b), !0 === this.options.scrollPerPage && (c = f(this.$owlItems[e]),
        c = c.data("owl-roundPages"), c !== a && (this.pagesInArray[a] = this.positionsInArray[e], a = c))
    },
    buildControls: function() {
      if (!0 === this.options.navigation || !0 === this.options.pagination) this.owlControls = f('<div class="owl-controls"/>').toggleClass("clickable", !this.browser.isTouch).appendTo(this.$elem);
      !0 === this.options.pagination && this.buildPagination();
      !0 === this.options.navigation && this.buildButtons()
    },
    buildButtons: function() {
      var a = this,
        b = f('<div class="owl-buttons"/>');
      a.owlControls.append(b);
      a.buttonPrev =
        f("<div/>", {
          "class": "owl-prev",
          html: a.options.navigationText[0] || ""
        });
      a.buttonNext = f("<div/>", {
        "class": "owl-next",
        html: a.options.navigationText[1] || ""
      });
      b.append(a.buttonPrev).append(a.buttonNext);
      b.on("touchstart.owlControls mousedown.owlControls", 'div[class^="owl"]', function(a) {
        a.preventDefault()
      });
      b.on("touchend.owlControls mouseup.owlControls", 'div[class^="owl"]', function(b) {
        b.preventDefault();
        f(this).hasClass("owl-next") ? a.next() : a.prev()
      })
    },
    buildPagination: function() {
      var a = this;
      a.paginationWrapper =
        f('<div class="owl-pagination"/>');
      a.owlControls.append(a.paginationWrapper);
      a.paginationWrapper.on("touchend.owlControls mouseup.owlControls", ".owl-page", function(b) {
        b.preventDefault();
        Number(f(this).data("owl-page")) !== a.currentItem && a.goTo(Number(f(this).data("owl-page")), !0)
      })
    },
    updatePagination: function() {
      var a, b, e, c, d, g;
      if (!1 === this.options.pagination) return !1;
      this.paginationWrapper.html("");
      a = 0;
      b = this.itemsAmount - this.itemsAmount % this.options.items;
      for (c = 0; c < this.itemsAmount; c += 1) 0 === c % this.options.items &&
        (a += 1, b === c && (e = this.itemsAmount - this.options.items), d = f("<div/>", {
          "class": "owl-page"
        }), g = f("<span></span>", {
          text: !0 === this.options.paginationNumbers ? a : "",
          "class": !0 === this.options.paginationNumbers ? "owl-numbers" : ""
        }), d.append(g), d.data("owl-page", b === c ? e : c), d.data("owl-roundPages", a), this.paginationWrapper.append(d));
      this.checkPagination()
    },
    checkPagination: function() {
      var a = this;
      if (!1 === a.options.pagination) return !1;
      a.paginationWrapper.find(".owl-page").each(function() {
        f(this).data("owl-roundPages") ===
          f(a.$owlItems[a.currentItem]).data("owl-roundPages") && (a.paginationWrapper.find(".owl-page").removeClass("active"), f(this).addClass("active"))
      })
    },
    checkNavigation: function() {
      if (!1 === this.options.navigation) return !1;
      !1 === this.options.rewindNav && (0 === this.currentItem && 0 === this.maximumItem ? (this.buttonPrev.addClass("disabled"), this.buttonNext.addClass("disabled")) : 0 === this.currentItem && 0 !== this.maximumItem ? (this.buttonPrev.addClass("disabled"), this.buttonNext.removeClass("disabled")) : this.currentItem ===
        this.maximumItem ? (this.buttonPrev.removeClass("disabled"), this.buttonNext.addClass("disabled")) : 0 !== this.currentItem && this.currentItem !== this.maximumItem && (this.buttonPrev.removeClass("disabled"), this.buttonNext.removeClass("disabled")))
    },
    updateControls: function() {
      this.updatePagination();
      this.checkNavigation();
      this.owlControls && (this.options.items >= this.itemsAmount ? this.owlControls.hide() : this.owlControls.show())
    },
    destroyControls: function() {
      this.owlControls && this.owlControls.remove()
    },
    next: function(a) {
      if (this.isTransition) return !1;
      this.currentItem += !0 === this.options.scrollPerPage ? this.options.items : 1;
      if (this.currentItem > this.maximumItem + (!0 === this.options.scrollPerPage ? this.options.items - 1 : 0))
        if (!0 === this.options.rewindNav) this.currentItem = 0, a = "rewind";
        else return this.currentItem = this.maximumItem, !1;
      this.goTo(this.currentItem, a)
    },
    prev: function(a) {
      if (this.isTransition) return !1;
      this.currentItem = !0 === this.options.scrollPerPage && 0 < this.currentItem && this.currentItem < this.options.items ? 0 : this.currentItem - (!0 === this.options.scrollPerPage ?
        this.options.items : 1);
      if (0 > this.currentItem)
        if (!0 === this.options.rewindNav) this.currentItem = this.maximumItem, a = "rewind";
        else return this.currentItem = 0, !1;
      this.goTo(this.currentItem, a)
    },
    goTo: function(a, b, e) {
      var c = this;
      if (c.isTransition) return !1;
      "function" === typeof c.options.beforeMove && c.options.beforeMove.apply(this, [c.$elem]);
      a >= c.maximumItem ? a = c.maximumItem : 0 >= a && (a = 0);
      c.currentItem = c.owl.currentItem = a;
      if (!1 !== c.options.transitionStyle && "drag" !== e && 1 === c.options.items && !0 === c.browser.support3d) return c.swapSpeed(0), !0 === c.browser.support3d ? c.transition3d(c.positionsInArray[a]) : c.css2slide(c.positionsInArray[a], 1), c.afterGo(), c.singleItemTransition(), !1;
      a = c.positionsInArray[a];
      !0 === c.browser.support3d ? (c.isCss3Finish = !1, !0 === b ? (c.swapSpeed("paginationSpeed"), g.setTimeout(function() {
        c.isCss3Finish = !0
      }, c.options.paginationSpeed)) : "rewind" === b ? (c.swapSpeed(c.options.rewindSpeed), g.setTimeout(function() {
        c.isCss3Finish = !0
      }, c.options.rewindSpeed)) : (c.swapSpeed("slideSpeed"), g.setTimeout(function() {
          c.isCss3Finish = !0
        },
        c.options.slideSpeed)), c.transition3d(a)) : !0 === b ? c.css2slide(a, c.options.paginationSpeed) : "rewind" === b ? c.css2slide(a, c.options.rewindSpeed) : c.css2slide(a, c.options.slideSpeed);
      c.afterGo()
    },
    jumpTo: function(a) {
      "function" === typeof this.options.beforeMove && this.options.beforeMove.apply(this, [this.$elem]);
      a >= this.maximumItem || -1 === a ? a = this.maximumItem : 0 >= a && (a = 0);
      this.swapSpeed(0);
      !0 === this.browser.support3d ? this.transition3d(this.positionsInArray[a]) : this.css2slide(this.positionsInArray[a], 1);
      this.currentItem =
        this.owl.currentItem = a;
      this.afterGo()
    },
    afterGo: function() {
      this.prevArr.push(this.currentItem);
      this.prevItem = this.owl.prevItem = this.prevArr[this.prevArr.length - 2];
      this.prevArr.shift(0);
      this.prevItem !== this.currentItem && (this.checkPagination(), this.checkNavigation(), this.eachMoveUpdate(), !1 !== this.options.autoPlay && this.checkAp());
      "function" === typeof this.options.afterMove && this.prevItem !== this.currentItem && this.options.afterMove.apply(this, [this.$elem])
    },
    stop: function() {
      this.apStatus = "stop";
      g.clearInterval(this.autoPlayInterval)
    },
    checkAp: function() {
      "stop" !== this.apStatus && this.play()
    },
    play: function() {
      var a = this;
      a.apStatus = "play";
      if (!1 === a.options.autoPlay) return !1;
      g.clearInterval(a.autoPlayInterval);
      a.autoPlayInterval = g.setInterval(function() {
        a.next(!0)
      }, a.options.autoPlay)
    },
    swapSpeed: function(a) {
      "slideSpeed" === a ? this.$owlWrapper.css(this.addCssSpeed(this.options.slideSpeed)) : "paginationSpeed" === a ? this.$owlWrapper.css(this.addCssSpeed(this.options.paginationSpeed)) : "string" !== typeof a && this.$owlWrapper.css(this.addCssSpeed(a))
    },
    addCssSpeed: function(a) {
      return {
        "-webkit-transition": "all " + a + "ms ease",
        "-moz-transition": "all " + a + "ms ease",
        "-o-transition": "all " + a + "ms ease",
        transition: "all " + a + "ms ease"
      }
    },
    removeTransition: function() {
      return {
        "-webkit-transition": "",
        "-moz-transition": "",
        "-o-transition": "",
        transition: ""
      }
    },
    doTranslate: function(a) {
      return {
        "-webkit-transform": "translate3d(" + a + "px, 0px, 0px)",
        "-moz-transform": "translate3d(" + a + "px, 0px, 0px)",
        "-o-transform": "translate3d(" + a + "px, 0px, 0px)",
        "-ms-transform": "translate3d(" +
          a + "px, 0px, 0px)",
        transform: "translate3d(" + a + "px, 0px,0px)"
      }
    },
    transition3d: function(a) {
      this.$owlWrapper.css(this.doTranslate(a))
    },
    css2move: function(a) {
      this.$owlWrapper.css({
        left: a
      })
    },
    css2slide: function(a, b) {
      var e = this;
      e.isCssFinish = !1;
      e.$owlWrapper.stop(!0, !0).animate({
        left: a
      }, {
        duration: b || e.options.slideSpeed,
        complete: function() {
          e.isCssFinish = !0
        }
      })
    },
    checkBrowser: function() {
      var a = k.createElement("div");
      a.style.cssText = "  -moz-transform:translate3d(0px, 0px, 0px); -ms-transform:translate3d(0px, 0px, 0px); -o-transform:translate3d(0px, 0px, 0px); -webkit-transform:translate3d(0px, 0px, 0px); transform:translate3d(0px, 0px, 0px)";
      a = a.style.cssText.match(/translate3d\(0px, 0px, 0px\)/g);
      this.browser = {
        support3d: null !== a && 1 === a.length,
        isTouch: "ontouchstart" in g || g.navigator.msMaxTouchPoints
      }
    },
    moveEvents: function() {
      if (!1 !== this.options.mouseDrag || !1 !== this.options.touchDrag) this.gestures(), this.disabledEvents()
    },
    eventTypes: function() {
      var a = ["s", "e", "x"];
      this.ev_types = {};
      !0 === this.options.mouseDrag && !0 === this.options.touchDrag ? a = ["touchstart.owl mousedown.owl", "touchmove.owl mousemove.owl", "touchend.owl touchcancel.owl mouseup.owl"] :
        !1 === this.options.mouseDrag && !0 === this.options.touchDrag ? a = ["touchstart.owl", "touchmove.owl", "touchend.owl touchcancel.owl"] : !0 === this.options.mouseDrag && !1 === this.options.touchDrag && (a = ["mousedown.owl", "mousemove.owl", "mouseup.owl"]);
      this.ev_types.start = a[0];
      this.ev_types.move = a[1];
      this.ev_types.end = a[2]
    },
    disabledEvents: function() {
      this.$elem.on("dragstart.owl", function(a) {
        a.preventDefault()
      });
      this.$elem.on("mousedown.disableTextSelect", function(a) {
        return f(a.target).is("input, textarea, select, option")
      })
    },
    gestures: function() {
      function a(a) {
        if (void 0 !== a.touches) return {
          x: a.touches[0].pageX,
          y: a.touches[0].pageY
        };
        if (void 0 === a.touches) {
          if (void 0 !== a.pageX) return {
            x: a.pageX,
            y: a.pageY
          };
          if (void 0 === a.pageX) return {
            x: a.clientX,
            y: a.clientY
          }
        }
      }

      function b(a) {
        "on" === a ? (f(k).on(d.ev_types.move, e), f(k).on(d.ev_types.end, c)) : "off" === a && (f(k).off(d.ev_types.move), f(k).off(d.ev_types.end))
      }

      function e(b) {
        b = b.originalEvent || b || g.event;
        d.newPosX = a(b).x - h.offsetX;
        d.newPosY = a(b).y - h.offsetY;
        d.newRelativeX = d.newPosX - h.relativePos;
        "function" === typeof d.options.startDragging && !0 !== h.dragging && 0 !== d.newRelativeX && (h.dragging = !0, d.options.startDragging.apply(d, [d.$elem]));
        (8 < d.newRelativeX || -8 > d.newRelativeX) && !0 === d.browser.isTouch && (void 0 !== b.preventDefault ? b.preventDefault() : b.returnValue = !1, h.sliding = !0);
        (10 < d.newPosY || -10 > d.newPosY) && !1 === h.sliding && f(k).off("touchmove.owl");
        d.newPosX = Math.max(Math.min(d.newPosX, d.newRelativeX / 5), d.maximumPixels + d.newRelativeX / 5);
        !0 === d.browser.support3d ? d.transition3d(d.newPosX) : d.css2move(d.newPosX)
      }

      function c(a) {
        a = a.originalEvent || a || g.event;
        var c;
        a.target = a.target || a.srcElement;
        h.dragging = !1;
        !0 !== d.browser.isTouch && d.$owlWrapper.removeClass("grabbing");
        d.dragDirection = 0 > d.newRelativeX ? d.owl.dragDirection = "left" : d.owl.dragDirection = "right";
        0 !== d.newRelativeX && (c = d.getNewPosition(), d.goTo(c, !1, "drag"), h.targetElement === a.target && !0 !== d.browser.isTouch && (f(a.target).on("click.disable", function(a) {
            a.stopImmediatePropagation();
            a.stopPropagation();
            a.preventDefault();
            f(a.target).off("click.disable")
          }),
          a = f._data(a.target, "events").click, c = a.pop(), a.splice(0, 0, c)));
        b("off")
      }
      var d = this,
        h = {
          offsetX: 0,
          offsetY: 0,
          baseElWidth: 0,
          relativePos: 0,
          position: null,
          minSwipe: null,
          maxSwipe: null,
          sliding: null,
          dargging: null,
          targetElement: null
        };
      d.isCssFinish = !0;
      d.$elem.on(d.ev_types.start, ".owl-wrapper", function(c) {
        c = c.originalEvent || c || g.event;
        var e;
        if (3 === c.which) return !1;
        if (!(d.itemsAmount <= d.options.items)) {
          if (!1 === d.isCssFinish && !d.options.dragBeforeAnimFinish || !1 === d.isCss3Finish && !d.options.dragBeforeAnimFinish) return !1;
          !1 !== d.options.autoPlay && g.clearInterval(d.autoPlayInterval);
          !0 === d.browser.isTouch || d.$owlWrapper.hasClass("grabbing") || d.$owlWrapper.addClass("grabbing");
          d.newPosX = 0;
          d.newRelativeX = 0;
          f(this).css(d.removeTransition());
          e = f(this).position();
          h.relativePos = e.left;
          h.offsetX = a(c).x - e.left;
          h.offsetY = a(c).y - e.top;
          b("on");
          h.sliding = !1;
          h.targetElement = c.target || c.srcElement
        }
      })
    },
    getNewPosition: function() {
      var a = this.closestItem();
      a > this.maximumItem ? a = this.currentItem = this.maximumItem : 0 <= this.newPosX && (this.currentItem =
        a = 0);
      return a
    },
    closestItem: function() {
      var a = this,
        b = !0 === a.options.scrollPerPage ? a.pagesInArray : a.positionsInArray,
        e = a.newPosX,
        c = null;
      f.each(b, function(d, g) {
        e - a.itemWidth / 20 > b[d + 1] && e - a.itemWidth / 20 < g && "left" === a.moveDirection() ? (c = g, a.currentItem = !0 === a.options.scrollPerPage ? f.inArray(c, a.positionsInArray) : d) : e + a.itemWidth / 20 < g && e + a.itemWidth / 20 > (b[d + 1] || b[d] - a.itemWidth) && "right" === a.moveDirection() && (!0 === a.options.scrollPerPage ? (c = b[d + 1] || b[b.length - 1], a.currentItem = f.inArray(c, a.positionsInArray)) :
          (c = b[d + 1], a.currentItem = d + 1))
      });
      return a.currentItem
    },
    moveDirection: function() {
      var a;
      0 > this.newRelativeX ? (a = "right", this.playDirection = "next") : (a = "left", this.playDirection = "prev");
      return a
    },
    customEvents: function() {
      var a = this;
      a.$elem.on("owl.next", function() {
        a.next()
      });
      a.$elem.on("owl.prev", function() {
        a.prev()
      });
      a.$elem.on("owl.play", function(b, e) {
        a.options.autoPlay = e;
        a.play();
        a.hoverStatus = "play"
      });
      a.$elem.on("owl.stop", function() {
        a.stop();
        a.hoverStatus = "stop"
      });
      a.$elem.on("owl.goTo", function(b, e) {
        a.goTo(e)
      });
      a.$elem.on("owl.jumpTo", function(b, e) {
        a.jumpTo(e)
      })
    },
    stopOnHover: function() {
      var a = this;
      !0 === a.options.stopOnHover && !0 !== a.browser.isTouch && !1 !== a.options.autoPlay && (a.$elem.on("mouseover", function() {
        a.stop()
      }), a.$elem.on("mouseout", function() {
        "stop" !== a.hoverStatus && a.play()
      }))
    },
    lazyLoad: function() {
      var a, b, e, c, d;
      if (!1 === this.options.lazyLoad) return !1;
      for (a = 0; a < this.itemsAmount; a += 1) b = f(this.$owlItems[a]), "loaded" !== b.data("owl-loaded") && (e = b.data("owl-item"), c = b.find(".lazyOwl"), "string" !== typeof c.data("src") ?
        b.data("owl-loaded", "loaded") : (void 0 === b.data("owl-loaded") && (c.hide(), b.addClass("loading").data("owl-loaded", "checked")), (d = !0 === this.options.lazyFollow ? e >= this.currentItem : !0) && e < this.currentItem + this.options.items && c.length && this.lazyPreload(b, c)))
    },
    lazyPreload: function(a, b) {
      function e() {
        a.data("owl-loaded", "loaded").removeClass("loading");
        b.removeAttr("data-src");
        "fade" === d.options.lazyEffect ? b.fadeIn(400) : b.show();
        "function" === typeof d.options.afterLazyLoad && d.options.afterLazyLoad.apply(this, [d.$elem])
      }

      function c() {
        f += 1;
        d.completeImg(b.get(0)) || !0 === k ? e() : 100 >= f ? g.setTimeout(c, 100) : e()
      }
      var d = this,
        f = 0,
        k;
      "DIV" === b.prop("tagName") ? (b.css("background-image", "url(" + b.data("src") + ")"), k = !0) : b[0].src = b.data("src");
      c()
    },
    autoHeight: function() {
      function a() {
        var a = f(e.$owlItems[e.currentItem]).height();
        e.wrapperOuter.css("height", a + "px");
        e.wrapperOuter.hasClass("autoHeight") || g.setTimeout(function() {
          e.wrapperOuter.addClass("autoHeight")
        }, 0)
      }

      function b() {
        d += 1;
        e.completeImg(c.get(0)) ? a() : 100 >= d ? g.setTimeout(b,
          100) : e.wrapperOuter.css("height", "")
      }
      var e = this,
        c = f(e.$owlItems[e.currentItem]).find("img"),
        d;
      void 0 !== c.get(0) ? (d = 0, b()) : a()
    },
    completeImg: function(a) {
      return !a.complete || "undefined" !== typeof a.naturalWidth && 0 === a.naturalWidth ? !1 : !0
    },
    onVisibleItems: function() {
      var a;
      !0 === this.options.addClassActive && this.$owlItems.removeClass("active");
      this.visibleItems = [];
      for (a = this.currentItem; a < this.currentItem + this.options.items; a += 1) this.visibleItems.push(a), !0 === this.options.addClassActive && f(this.$owlItems[a]).addClass("active");
      this.owl.visibleItems = this.visibleItems
    },
    transitionTypes: function(a) {
      this.outClass = "owl-" + a + "-out";
      this.inClass = "owl-" + a + "-in"
    },
    singleItemTransition: function() {
      var a = this,
        b = a.outClass,
        e = a.inClass,
        c = a.$owlItems.eq(a.currentItem),
        d = a.$owlItems.eq(a.prevItem),
        f = Math.abs(a.positionsInArray[a.currentItem]) + a.positionsInArray[a.prevItem],
        g = Math.abs(a.positionsInArray[a.currentItem]) + a.itemWidth / 2;
      a.isTransition = !0;
      a.$owlWrapper.addClass("owl-origin").css({
        "-webkit-transform-origin": g + "px",
        "-moz-perspective-origin": g +
          "px",
        "perspective-origin": g + "px"
      });
      d.css({
        position: "relative",
        left: f + "px"
      }).addClass(b).on("webkitAnimationEnd oAnimationEnd MSAnimationEnd animationend", function() {
        a.endPrev = !0;
        d.off("webkitAnimationEnd oAnimationEnd MSAnimationEnd animationend");
        a.clearTransStyle(d, b)
      });
      c.addClass(e).on("webkitAnimationEnd oAnimationEnd MSAnimationEnd animationend", function() {
        a.endCurrent = !0;
        c.off("webkitAnimationEnd oAnimationEnd MSAnimationEnd animationend");
        a.clearTransStyle(c, e)
      })
    },
    clearTransStyle: function(a,
      b) {
      a.css({
        position: "",
        left: ""
      }).removeClass(b);
      this.endPrev && this.endCurrent && (this.$owlWrapper.removeClass("owl-origin"), this.isTransition = this.endCurrent = this.endPrev = !1)
    },
    owlStatus: function() {
      this.owl = {
        userOptions: this.userOptions,
        baseElement: this.$elem,
        userItems: this.$userItems,
        owlItems: this.$owlItems,
        currentItem: this.currentItem,
        prevItem: this.prevItem,
        visibleItems: this.visibleItems,
        isTouch: this.browser.isTouch,
        browser: this.browser,
        dragDirection: this.dragDirection
      }
    },
    clearEvents: function() {
      this.$elem.off(".owl owl mousedown.disableTextSelect");
      f(k).off(".owl owl");
      f(g).off("resize", this.resizer)
    },
    unWrap: function() {
      0 !== this.$elem.children().length && (this.$owlWrapper.unwrap(), this.$userItems.unwrap().unwrap(), this.owlControls && this.owlControls.remove());
      this.clearEvents();
      this.$elem.attr("style", this.$elem.data("owl-originalStyles") || "").attr("class", this.$elem.data("owl-originalClasses"))
    },
    destroy: function() {
      this.stop();
      g.clearInterval(this.checkVisible);
      this.unWrap();
      this.$elem.removeData()
    },
    reinit: function(a) {
      a = f.extend({}, this.userOptions,
        a);
      this.unWrap();
      this.init(a, this.$elem)
    },
    addItem: function(a, b) {
      var e;
      if (!a) return !1;
      if (0 === this.$elem.children().length) return this.$elem.append(a), this.setVars(), !1;
      this.unWrap();
      e = void 0 === b || -1 === b ? -1 : b;
      e >= this.$userItems.length || -1 === e ? this.$userItems.eq(-1).after(a) : this.$userItems.eq(e).before(a);
      this.setVars()
    },
    removeItem: function(a) {
      if (0 === this.$elem.children().length) return !1;
      a = void 0 === a || -1 === a ? -1 : a;
      this.unWrap();
      this.$userItems.eq(a).remove();
      this.setVars()
    }
  };
  f.fn.owlCarousel = function(a) {
    return this.each(function() {
      if (!0 ===
        f(this).data("owl-init")) return !1;
      f(this).data("owl-init", !0);
      var b = Object.create(l);
      b.init(a, this);
      f.data(this, "owlCarousel", b)
    })
  };
  f.fn.owlCarousel.options = {
    items: 5,
    itemsCustom: !1,
    itemsDesktop: [1199, 4],
    itemsDesktopSmall: [979, 3],
    itemsTablet: [768, 2],
    itemsTabletSmall: !1,
    itemsMobile: [479, 1],
    singleItem: !1,
    itemsScaleUp: !1,
    slideSpeed: 200,
    paginationSpeed: 800,
    rewindSpeed: 1E3,
    autoPlay: !1,
    stopOnHover: !1,
    navigation: !1,
    navigationText: ["prev", "next"],
    rewindNav: !0,
    scrollPerPage: !1,
    pagination: !0,
    paginationNumbers: !1,
    responsive: !0,
    responsiveRefreshRate: 200,
    responsiveBaseWidth: g,
    baseClass: "owl-carousel",
    theme: "owl-theme",
    lazyLoad: !1,
    lazyFollow: !0,
    lazyEffect: "fade",
    autoHeight: !1,
    jsonPath: !1,
    jsonSuccess: !1,
    dragBeforeAnimFinish: !0,
    mouseDrag: !0,
    touchDrag: !0,
    addClassActive: !1,
    transitionStyle: !1,
    beforeUpdate: !1,
    afterUpdate: !1,
    beforeInit: !1,
    afterInit: !1,
    beforeMove: !1,
    afterMove: !1,
    afterAction: !1,
    startDragging: !1,
    afterLazyLoad: !1
  }
})(jQuery, window, document);
/*!
 * Bootstrap-select v1.6.5 (http://silviomoreto.github.io/bootstrap-select)
 *
 * Copyright 2013-2015 bootstrap-select
 * Licensed under MIT (https://github.com/silviomoreto/bootstrap-select/blob/master/LICENSE)
 */
! function(a) {
  "use strict";

  function b(b) {
    var c = [{
      re: /[\xC0-\xC6]/g,
      ch: "A"
    }, {
      re: /[\xE0-\xE6]/g,
      ch: "a"
    }, {
      re: /[\xC8-\xCB]/g,
      ch: "E"
    }, {
      re: /[\xE8-\xEB]/g,
      ch: "e"
    }, {
      re: /[\xCC-\xCF]/g,
      ch: "I"
    }, {
      re: /[\xEC-\xEF]/g,
      ch: "i"
    }, {
      re: /[\xD2-\xD6]/g,
      ch: "O"
    }, {
      re: /[\xF2-\xF6]/g,
      ch: "o"
    }, {
      re: /[\xD9-\xDC]/g,
      ch: "U"
    }, {
      re: /[\xF9-\xFC]/g,
      ch: "u"
    }, {
      re: /[\xC7-\xE7]/g,
      ch: "c"
    }, {
      re: /[\xD1]/g,
      ch: "N"
    }, {
      re: /[\xF1]/g,
      ch: "n"
    }];
    return a.each(c, function() {
      b = b.replace(this.re, this.ch)
    }), b
  }

  function c(a) {
    var b = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#x27;",
        "`": "&#x60;"
      },
      c = "(?:" + Object.keys(b).join("|") + ")",
      d = new RegExp(c),
      e = new RegExp(c, "g"),
      f = null == a ? "" : "" + a;
    return d.test(f) ? f.replace(e, function(a) {
      return b[a]
    }) : f
  }

  function d(b, c) {
    var d = arguments,
      f = b,
      g = c;
    [].shift.apply(d);
    var h, i = this.each(function() {
      var b = a(this);
      if (b.is("select")) {
        var c = b.data("selectpicker"),
          i = "object" == typeof f && f;
        if (c) {
          if (i)
            for (var j in i) i.hasOwnProperty(j) && (c.options[j] = i[j])
        } else {
          var k = a.extend({}, e.DEFAULTS, a.fn.selectpicker.defaults || {}, b.data(), i);
          b.data("selectpicker", c = new e(this, k, g))
        }
        "string" == typeof f && (h = c[f] instanceof Function ? c[f].apply(c, d) : c.options[f])
      }
    });
    return "undefined" != typeof h ? h : i
  }
  String.prototype.includes || ! function() {
    var a = {}.toString,
      b = function() {
        try {
          var a = {},
            b = Object.defineProperty,
            c = b(a, a, a) && b
        } catch (d) {}
        return c
      }(),
      c = "".indexOf,
      d = function(b) {
        if (null == this) throw TypeError();
        var d = String(this);
        if (b && "[object RegExp]" == a.call(b)) throw TypeError();
        var e = d.length,
          f = String(b),
          g = f.length,
          h = arguments.length > 1 ? arguments[1] : void 0,
          i = h ? Number(h) : 0;
        i != i && (i = 0);
        var j = Math.min(Math.max(i, 0), e);
        return g + j > e ? !1 : -1 != c.call(d, f, i)
      };
    b ? b(String.prototype, "includes", {
      value: d,
      configurable: !0,
      writable: !0
    }) : String.prototype.includes = d
  }(), String.prototype.startsWith || ! function() {
    var a = function() {
        try {
          var a = {},
            b = Object.defineProperty,
            c = b(a, a, a) && b
        } catch (d) {}
        return c
      }(),
      b = {}.toString,
      c = function(a) {
        if (null == this) throw TypeError();
        var c = String(this);
        if (a && "[object RegExp]" == b.call(a)) throw TypeError();
        var d = c.length,
          e = String(a),
          f = e.length,
          g = arguments.length > 1 ? arguments[1] : void 0,
          h = g ? Number(g) : 0;
        h != h && (h = 0);
        var i = Math.min(Math.max(h, 0), d);
        if (f + i > d) return !1;
        for (var j = -1; ++j < f;)
          if (c.charCodeAt(i + j) != e.charCodeAt(j)) return !1;
        return !0
      };
    a ? a(String.prototype, "startsWith", {
      value: c,
      configurable: !0,
      writable: !0
    }) : String.prototype.startsWith = c
  }(), a.expr[":"].icontains = function(b, c, d) {
    var e = a(b),
      f = (e.data("tokens") || e.text()).toUpperCase();
    return f.includes(d[3].toUpperCase())
  }, a.expr[":"].ibegins = function(b, c, d) {
    var e = a(b),
      f = (e.data("tokens") || e.text()).toUpperCase();
    return f.startsWith(d[3].toUpperCase())
  }, a.expr[":"].aicontains = function(b, c, d) {
    var e = a(b),
      f = (e.data("tokens") || e.data("normalizedText") || e.text()).toUpperCase();
    return f.includes(f, d[3])
  }, a.expr[":"].aibegins = function(b, c, d) {
    var e = a(b),
      f = (e.data("tokens") || e.data("normalizedText") || e.text()).toUpperCase();
    return f.startsWith(d[3].toUpperCase())
  };
  var e = function(b, c, d) {
    d && (d.stopPropagation(), d.preventDefault()), this.$element = a(b), this.$newElement = null, this.$button = null, this.$menu = null, this.$lis = null, this.options = c, null === this.options.title && (this.options.title = this.$element.attr("title")), this.val = e.prototype.val, this.render = e.prototype.render, this.refresh = e.prototype.refresh, this.setStyle = e.prototype.setStyle, this.selectAll = e.prototype.selectAll, this.deselectAll = e.prototype.deselectAll, this.destroy = e.prototype.remove, this.remove = e.prototype.remove, this.show = e.prototype.show, this.hide = e.prototype.hide, this.init()
  };
  e.VERSION = "1.6.5", e.DEFAULTS = {
    noneSelectedText: "Nothing selected",
    noneResultsText: "No results matched {0}",
    countSelectedText: function(a) {
      return 1 == a ? "{0} item selected" : "{0} items selected"
    },
    maxOptionsText: function(a, b) {
      return [1 == a ? "Limit reached ({n} item max)" : "Limit reached ({n} items max)", 1 == b ? "Group limit reached ({n} item max)" : "Group limit reached ({n} items max)"]
    },
    selectAllText: "Select All",
    deselectAllText: "Deselect All",
    doneButton: !1,
    doneButtonText: "Close",
    multipleSeparator: ", ",
    style: "btn-default",
    size: "auto",
    title: null,
    selectedTextFormat: "values",
    width: !1,
    container: !1,
    hideDisabled: !1,
    showSubtext: !1,
    showIcon: !0,
    showContent: !0,
    dropupAuto: !0,
    header: !1,
    liveSearch: !1,
    liveSearchPlaceholder: null,
    liveSearchNormalize: !1,
    liveSearchStyle: "contains",
    actionsBox: !1,
    iconBase: "glyphicon",
    tickIcon: "glyphicon-ok",
    maxOptions: !1,
    mobile: !1,
    selectOnTab: !1,
    dropdownAlignRight: !1
  }, e.prototype = {
    constructor: e,
    init: function() {
      var b = this,
        c = this.$element.attr("id");
      this.$element.hide(), this.multiple = this.$element.prop("multiple"), this.autofocus = this.$element.prop("autofocus"), this.$newElement = this.createView(), this.$element.after(this.$newElement), this.$button = this.$newElement.children("button"), this.$menu = this.$newElement.children(".dropdown-menu"), this.$searchbox = this.$menu.find("input"), this.options.dropdownAlignRight && this.$menu.addClass("dropdown-menu-right"), "undefined" != typeof c && (this.$button.attr("data-id", c), a('label[for="' + c + '"]').click(function(a) {
        a.preventDefault(), b.$button.focus()
      })), this.checkDisabled(), this.clickListener(), this.options.liveSearch && this.liveSearchListener(), this.render(), this.liHeight(), this.setStyle(), this.setWidth(), this.options.container && this.selectPosition(), this.$menu.data("this", this), this.$newElement.data("this", this), this.options.mobile && this.mobile()
    },
    createDropdown: function() {
      var b = this.multiple ? " show-tick" : "",
        d = this.$element.parent().hasClass("input-group") ? " input-group-btn" : "",
        e = this.autofocus ? " autofocus" : "",
        f = this.options.header ? '<div class="popover-title"><button type="button" class="close" aria-hidden="true">&times;</button>' + this.options.header + "</div>" : "",
        g = this.options.liveSearch ? '<div class="bs-searchbox"><input type="text" class="form-control" autocomplete="off"' + (null === this.options.liveSearchPlaceholder ? "" : ' placeholder="' + c(this.options.liveSearchPlaceholder) + '"') + "></div>" : "",
        h = this.multiple && this.options.actionsBox ? '<div class="bs-actionsbox"><div class="btn-group btn-group-sm btn-block"><button class="actions-btn bs-select-all btn btn-default">' + this.options.selectAllText + '</button><button class="actions-btn bs-deselect-all btn btn-default">' + this.options.deselectAllText + "</button></div></div>" : "",
        i = this.multiple && this.options.doneButton ? '<div class="bs-donebutton"><div class="btn-group btn-block"><button class="btn btn-sm btn-default">' + this.options.doneButtonText + "</button></div></div>" : "",
        j = '<div class="btn-group bootstrap-select' + b + d + '"><button type="button" class="btn dropdown-toggle" data-toggle="dropdown"' + e + '><span class="filter-option pull-left"></span>&nbsp;<span class="caretx"><i class="fa fa-fw"></i></span></button><div class="dropdown-menu open">' + f + g + h + '<ul class="dropdown-menu inner" role="menu"></ul>' + i + "</div></div>";
      return a(j)
    },
    createView: function() {
      var a = this.createDropdown(),
        b = this.createLi();
      return a.find("ul").append(b), a
    },
    reloadLi: function() {
      this.destroyLi();
      var a = this.createLi();
      this.$menu.find("ul").append(a)
    },
    destroyLi: function() {
      this.$menu.find("li").remove()
    },
    createLi: function() {
      var d = this,
        e = [],
        f = 0,
        g = function(a, b, c, d) {
          return "<li" + ("undefined" != typeof c & "" !== c ? ' class="' + c + '"' : "") + ("undefined" != typeof b & null !== b ? ' data-original-index="' + b + '"' : "") + ("undefined" != typeof d & null !== d ? 'data-optgroup="' + d + '"' : "") + ">" + a + "</li>"
        },
        h = function(a, e, f, g) {
          return '<a tabindex="0"' + ("undefined" != typeof e ? ' class="' + e + '"' : "") + ("undefined" != typeof f ? ' style="' + f + '"' : "") + ' data-normalized-text="' + b(c(a)) + '"' + ("undefined" != typeof g || null !== g ? ' data-tokens="' + g + '"' : "") + ">" + a + '<span class="' + d.options.iconBase + " " + d.options.tickIcon + ' check-mark"></span></a>'
        };
      return this.$element.find("option").each(function(b) {
        var c = a(this),
          i = c.attr("class") || "",
          j = c.attr("style"),
          k = c.data("content") ? c.data("content") : c.html(),
          l = c.data("tokens") ? c.data("tokens") : null,
          m = "undefined" != typeof c.data("subtext") ? '<small class="text-muted">' + c.data("subtext") + "</small>" : "",
          n = "undefined" != typeof c.data("icon") ? '<span class="' + d.options.iconBase + " " + c.data("icon") + '"></span> ' : "",
          o = c.is(":disabled") || c.parent().is(":disabled");
        if ("" !== n && o && (n = "<span>" + n + "</span>"), c.data("content") || (k = n + '<span class="text">' + k + m + "</span>"), !d.options.hideDisabled || !o)
          if (c.parent().is("optgroup") && c.data("divider") !== !0) {
            if (0 === c.index()) {
              f += 1;
              var p = c.parent().attr("label"),
                q = "undefined" != typeof c.parent().data("subtext") ? '<small class="text-muted">' + c.parent().data("subtext") + "</small>" : "",
                r = c.parent().data("icon") ? '<span class="' + d.options.iconBase + " " + c.parent().data("icon") + '"></span> ' : "";
              p = r + '<span class="text">' + p + q + "</span>", 0 !== b && e.length > 0 && e.push(g("", null, "divider", f + "div")), e.push(g(p, null, "dropdown-header", f))
            }
            e.push(g(h(k, "opt " + i, j, l), b, "", f))
          } else c.data("divider") === !0 ? e.push(g("", b, "divider")) : c.data("hidden") === !0 ? e.push(g(h(k, i, j, l), b, "hidden is-hidden")) : (c.prev().is("optgroup") && e.push(g("", null, "divider", f + "div")), e.push(g(h(k, i, j, l), b)))
      }), this.multiple || 0 !== this.$element.find("option:selected").length || this.options.title || this.$element.find("option").eq(0).prop("selected", !0).attr("selected", "selected"), a(e.join(""))
    },
    findLis: function() {
      return null == this.$lis && (this.$lis = this.$menu.find("li")), this.$lis
    },
    render: function(b) {
      var c = this;
      b !== !1 && this.$element.find("option").each(function(b) {
        c.setDisabled(b, a(this).is(":disabled") || a(this).parent().is(":disabled")), c.setSelected(b, a(this).is(":selected"))
      }), this.tabIndex();
      var d = this.options.hideDisabled ? ":enabled" : "",
        e = this.$element.find("option:selected" + d).map(function() {
          var b, d = a(this),
            e = d.data("icon") && c.options.showIcon ? '<i class="' + c.options.iconBase + " " + d.data("icon") + '"></i> ' : "";
          return b = c.options.showSubtext && d.data("subtext") && !c.multiple ? ' <small class="text-muted">' + d.data("subtext") + "</small>" : "", "undefined" != typeof d.attr("title") ? d.attr("title") : d.data("content") && c.options.showContent ? d.data("content") : e + d.html() + b
        }).toArray(),
        f = this.multiple ? e.join(this.options.multipleSeparator) : e[0];
      if (this.multiple && this.options.selectedTextFormat.indexOf("count") > -1) {
        var g = this.options.selectedTextFormat.split(">");
        if (g.length > 1 && e.length > g[1] || 1 == g.length && e.length >= 2) {
          d = this.options.hideDisabled ? ", [disabled]" : "";
          var h = this.$element.find("option").not('[data-divider="true"], [data-hidden="true"]' + d).length,
            i = "function" == typeof this.options.countSelectedText ? this.options.countSelectedText(e.length, h) : this.options.countSelectedText;
          f = i.replace("{0}", e.length.toString()).replace("{1}", h.toString())
        }
      }
      void 0 == this.options.title && (this.options.title = this.$element.attr("title")), "static" == this.options.selectedTextFormat && (f = this.options.title), f || (f = "undefined" != typeof this.options.title ? this.options.title : this.options.noneSelectedText), this.$button.attr("title", a.trim(f.replace(/<[^>]*>?/g, ""))), this.$button.children(".filter-option").html(f)
    },
    setStyle: function(a, b) {
      this.$element.attr("class") && this.$newElement.addClass(this.$element.attr("class").replace(/selectpicker|mobile-device|validate\[.*\]/gi, ""));
      var c = a ? a : this.options.style;
      "add" == b ? this.$button.addClass(c) : "remove" == b ? this.$button.removeClass(c) : (this.$button.removeClass(this.options.style), this.$button.addClass(c))
    },
    liHeight: function() {
      if (this.options.size !== !1) {
        var a = this.$menu.parent().clone().children(".dropdown-toggle").prop("autofocus", !1).end().appendTo("body"),
          b = a.addClass("open").children(".dropdown-menu"),
          c = b.find("li").not(".divider, .dropdown-header").filter(":visible").children("a").outerHeight(),
          d = this.options.header ? b.find(".popover-title").outerHeight() : 0,
          e = this.options.liveSearch ? b.find(".bs-searchbox").outerHeight() : 0,
          f = this.options.actionsBox ? b.find(".bs-actionsbox").outerHeight() : 0,
          g = this.multiple ? b.find(".bs-donebutton").outerHeight() : 0;
        a.remove(), this.$newElement.data("liHeight", c).data("headerHeight", d).data("searchHeight", e).data("actionsHeight", f).data("doneButtonHeight", g)
      }
    },
    setSize: function() {
      this.findLis();
      var b, c, d, e = this,
        f = this.$menu,
        g = f.children(".inner"),
        h = this.$newElement.outerHeight(),
        i = this.$newElement.data("liHeight"),
        j = this.$newElement.data("headerHeight"),
        k = this.$newElement.data("searchHeight"),
        l = this.$newElement.data("actionsHeight"),
        m = this.$newElement.data("doneButtonHeight"),
        n = this.$lis.filter(".divider").outerHeight(!0),
        o = parseInt(f.css("padding-top")) + parseInt(f.css("padding-bottom")) + parseInt(f.css("border-top-width")) + parseInt(f.css("border-bottom-width")),
        p = this.options.hideDisabled ? ".disabled" : "",
        q = a(window),
        r = o + parseInt(f.css("margin-top")) + parseInt(f.css("margin-bottom")) + 2,
        s = function() {
          c = e.$newElement.offset().top - q.scrollTop(), d = q.height() - c - h
        };
      if (s(), this.options.header && f.css("padding-top", 0), "auto" == this.options.size) {
        var t = function() {
          var a, h = e.$lis.not(".hidden");
          s(), b = d - r, e.options.dropupAuto && e.$newElement.toggleClass("dropup", c > d && b - r < f.height()), e.$newElement.hasClass("dropup") && (b = c - r), a = h.length + h.filter(".dropdown-header").length > 3 ? 3 * i + r - 2 : 0, f.css({
            "max-height": b + "px",
            overflow: "hidden",
            "min-height": a + j + k + l + m + "px"
          }), g.css({
            "max-height": b - j - k - l - m - o + "px",
            "overflow-y": "auto",
            "min-height": Math.max(a - o, 0) + "px"
          })
        };
        t(), this.$searchbox.off("input.getSize propertychange.getSize").on("input.getSize propertychange.getSize", t), q.off("resize.getSize scroll.getSize").on("resize.getSize scroll.getSize", t)
      } else if (this.options.size && "auto" != this.options.size && f.find("li").not(p).length > this.options.size) {
        var u = this.$lis.not(".divider").not(p).children().slice(0, this.options.size).last().parent().index(),
          v = this.$lis.slice(0, u + 1).filter(".divider").length;
        b = i * this.options.size + v * n + o, e.options.dropupAuto && this.$newElement.toggleClass("dropup", c > d && b < f.height()), f.css({
          "max-height": b + j + k + l + m + "px",
          overflow: "hidden"
        }), g.css({
          "max-height": b - o + "px",
          "overflow-y": "auto"
        })
      }
    },
    setWidth: function() {
      if ("auto" == this.options.width) {
        this.$menu.css("min-width", "0");
        var a = this.$newElement.clone().appendTo("body"),
          b = a.children(".dropdown-menu").css("width"),
          c = a.css("width", "auto").children("button").css("width");
        a.remove(), this.$newElement.css("width", Math.max(parseInt(b), parseInt(c)) + "px")
      } else "fit" == this.options.width ? (this.$menu.css("min-width", ""), this.$newElement.css("width", "").addClass("fit-width")) : this.options.width ? (this.$menu.css("min-width", ""), this.$newElement.css("width", this.options.width)) : (this.$menu.css("min-width", ""), this.$newElement.css("width", ""));
      this.$newElement.hasClass("fit-width") && "fit" !== this.options.width && this.$newElement.removeClass("fit-width")
    },
    selectPosition: function() {
      var b, c, d = this,
        e = "<div />",
        f = a(e),
        g = function(a) {
          f.addClass(a.attr("class").replace(/form-control/gi, "")).toggleClass("dropup", a.hasClass("dropup")), b = a.offset(), c = a.hasClass("dropup") ? 0 : a[0].offsetHeight, f.css({
            top: b.top + c,
            left: b.left,
            width: a[0].offsetWidth,
            position: "absolute"
          })
        };
      this.$newElement.on("click", function() {
        d.isDisabled() || (g(a(this)), f.appendTo(d.options.container), f.toggleClass("open", !a(this).hasClass("open")), f.append(d.$menu))
      }), a(window).on("resize scroll", function() {
        g(d.$newElement)
      }), a("html").on("click", function(b) {
        a(b.target).closest(d.$newElement).length < 1 && f.removeClass("open")
      })
    },
    setSelected: function(a, b) {
      this.findLis(), this.$lis.filter('[data-original-index="' + a + '"]').toggleClass("selected", b)
    },
    setDisabled: function(a, b) {
      this.findLis(), b ? this.$lis.filter('[data-original-index="' + a + '"]').addClass("disabled").children("a").attr("href", "#").attr("tabindex", -1) : this.$lis.filter('[data-original-index="' + a + '"]').removeClass("disabled").children("a").removeAttr("href").attr("tabindex", 0)
    },
    isDisabled: function() {
      return this.$element.is(":disabled")
    },
    checkDisabled: function() {
      var a = this;
      this.isDisabled() ? this.$button.addClass("disabled").attr("tabindex", -1) : (this.$button.hasClass("disabled") && this.$button.removeClass("disabled"), -1 != this.$button.attr("tabindex") || this.$element.data("tabindex") || this.$button.removeAttr("tabindex")), this.$button.click(function() {
        return !a.isDisabled()
      })
    },
    tabIndex: function() {
      this.$element.is("[tabindex]") && (this.$element.data("tabindex", this.$element.attr("tabindex")), this.$button.attr("tabindex", this.$element.data("tabindex")))
    },
    clickListener: function() {
      var b = this;
      this.$newElement.on("touchstart.dropdown", ".dropdown-menu", function(a) {
        a.stopPropagation()
      }), this.$newElement.on("click", function() {
        b.setSize(), b.options.liveSearch || b.multiple || setTimeout(function() {
          b.$menu.find(".selected a").focus()
        }, 10)
      }), this.$menu.on("click", "li a", function(c) {
        var d = a(this),
          e = d.parent().data("originalIndex"),
          f = b.$element.val(),
          g = b.$element.prop("selectedIndex");
        if (b.multiple && c.stopPropagation(), c.preventDefault(), !b.isDisabled() && !d.parent().hasClass("disabled")) {
          var h = b.$element.find("option"),
            i = h.eq(e),
            j = i.prop("selected"),
            k = i.parent("optgroup"),
            l = b.options.maxOptions,
            m = k.data("maxOptions") || !1;
          if (b.multiple) {
            if (i.prop("selected", !j), b.setSelected(e, !j), d.blur(), l !== !1 || m !== !1) {
              var n = l < h.filter(":selected").length,
                o = m < k.find("option:selected").length;
              if (l && n || m && o)
                if (l && 1 == l) h.prop("selected", !1), i.prop("selected", !0), b.$menu.find(".selected").removeClass("selected"), b.setSelected(e, !0);
                else if (m && 1 == m) {
                k.find("option:selected").prop("selected", !1), i.prop("selected", !0);
                var p = d.data("optgroup");
                b.$menu.find(".selected").has('a[data-optgroup="' + p + '"]').removeClass("selected"), b.setSelected(e, !0)
              } else {
                var q = "function" == typeof b.options.maxOptionsText ? b.options.maxOptionsText(l, m) : b.options.maxOptionsText,
                  r = q[0].replace("{n}", l),
                  s = q[1].replace("{n}", m),
                  t = a('<div class="notify"></div>');
                q[2] && (r = r.replace("{var}", q[2][l > 1 ? 0 : 1]), s = s.replace("{var}", q[2][m > 1 ? 0 : 1])), i.prop("selected", !1), b.$menu.append(t), l && n && (t.append(a("<div>" + r + "</div>")), b.$element.trigger("maxReached.bs.select")), m && o && (t.append(a("<div>" + s + "</div>")), b.$element.trigger("maxReachedGrp.bs.select")), setTimeout(function() {
                  b.setSelected(e, !1)
                }, 10), t.delay(750).fadeOut(300, function() {
                  a(this).remove()
                })
              }
            }
          } else h.prop("selected", !1), i.prop("selected", !0), b.$menu.find(".selected").removeClass("selected"), b.setSelected(e, !0);
          b.multiple ? b.options.liveSearch && b.$searchbox.focus() : b.$button.focus(), (f != b.$element.val() && b.multiple || g != b.$element.prop("selectedIndex") && !b.multiple) && b.$element.change()
        }
      }), this.$menu.on("click", "li.disabled a, .popover-title, .popover-title :not(.close)", function(a) {
        a.currentTarget == this && (a.preventDefault(), a.stopPropagation(), b.options.liveSearch ? b.$searchbox.focus() : b.$button.focus())
      }), this.$menu.on("click", "li.divider, li.dropdown-header", function(a) {
        a.preventDefault(), a.stopPropagation(), b.options.liveSearch ? b.$searchbox.focus() : b.$button.focus()
      }), this.$menu.on("click", ".popover-title .close", function() {
        b.$button.focus()
      }), this.$searchbox.on("click", function(a) {
        a.stopPropagation()
      }), this.$menu.on("click", ".actions-btn", function(c) {
        b.options.liveSearch ? b.$searchbox.focus() : b.$button.focus(), c.preventDefault(), c.stopPropagation(), a(this).hasClass("bs-select-all") ? b.selectAll() : b.deselectAll(), b.$element.change()
      }), this.$element.change(function() {
        b.render(!1)
      })
    },
    liveSearchListener: function() {
      var d = this,
        e = a('<li class="no-results"></li>');
      this.$newElement.on("click.dropdown.data-api touchstart.dropdown.data-api", function() {
        d.$menu.find(".active").removeClass("active"), d.$searchbox.val() && (d.$searchbox.val(""), d.$lis.not(".is-hidden").removeClass("hidden"), e.parent().length && e.remove()), d.multiple || d.$menu.find(".selected").addClass("active"), setTimeout(function() {
          d.$searchbox.focus()
        }, 10)
      }), this.$searchbox.on("click.dropdown.data-api focus.dropdown.data-api touchend.dropdown.data-api", function(a) {
        a.stopPropagation()
      }), this.$searchbox.on("input propertychange", function() {
        if (d.$searchbox.val()) {
          var f = d.$lis.not(".is-hidden").removeClass("hidden").children("a");
          f = f.not(d.options.liveSearchNormalize ? ":a" + d._searchStyle() + "(" + b(d.$searchbox.val()) + ")" : ":" + d._searchStyle() + "(" + d.$searchbox.val() + ")"), f.parent().addClass("hidden"), d.$lis.filter(".dropdown-header").each(function() {
            var b = a(this),
              c = b.data("optgroup");
            0 === d.$lis.filter("[data-optgroup=" + c + "]").not(b).not(".hidden").length && (b.addClass("hidden"), d.$lis.filter("[data-optgroup=" + c + "div]").addClass("hidden"))
          });
          var g = d.$lis.not(".hidden");
          g.each(function(b) {
            var c = a(this);
            c.hasClass("divider") && (c.index() === g.eq(0).index() || c.index() === g.last().index() || g.eq(b + 1).hasClass("divider")) && c.addClass("hidden")
          }), d.$lis.not(".hidden, .no-results").length ? e.parent().length && e.remove() : (e.parent().length && e.remove(), e.html(d.options.noneResultsText.replace("{0}", '"' + c(d.$searchbox.val()) + '"')).show(), d.$menu.append(e))
        } else d.$lis.not(".is-hidden").removeClass("hidden"), e.parent().length && e.remove();
        d.$lis.filter(".active").removeClass("active"), d.$lis.not(".hidden, .divider, .dropdown-header").eq(0).addClass("active").children("a").focus(), a(this).focus()
      })
    },
    _searchStyle: function() {
      var a = "icontains";
      switch (this.options.liveSearchStyle) {
        case "begins":
        case "startsWith":
          a = "ibegins";
          break;
        case "contains":
      }
      return a
    },
    val: function(a) {
      return "undefined" != typeof a ? (this.$element.val(a), this.render(), this.$element) : this.$element.val()
    },
    selectAll: function() {
      this.findLis(), this.$element.find("option:enabled").not("[data-divider], [data-hidden]").prop("selected", !0), this.$lis.not(".divider, .dropdown-header, .disabled, .hidden").addClass("selected"), this.render(!1)
    },
    deselectAll: function() {
      this.findLis(), this.$element.find("option:enabled").not("[data-divider], [data-hidden]").prop("selected", !1), this.$lis.not(".divider, .dropdown-header, .disabled, .hidden").removeClass("selected"), this.render(!1)
    },
    keydown: function(c) {
      var d, e, f, g, h, i, j, k, l, m = a(this),
        n = m.is("input") ? m.parent().parent() : m.parent(),
        o = n.data("this"),
        p = {
          32: " ",
          48: "0",
          49: "1",
          50: "2",
          51: "3",
          52: "4",
          53: "5",
          54: "6",
          55: "7",
          56: "8",
          57: "9",
          59: ";",
          65: "a",
          66: "b",
          67: "c",
          68: "d",
          69: "e",
          70: "f",
          71: "g",
          72: "h",
          73: "i",
          74: "j",
          75: "k",
          76: "l",
          77: "m",
          78: "n",
          79: "o",
          80: "p",
          81: "q",
          82: "r",
          83: "s",
          84: "t",
          85: "u",
          86: "v",
          87: "w",
          88: "x",
          89: "y",
          90: "z",
          96: "0",
          97: "1",
          98: "2",
          99: "3",
          100: "4",
          101: "5",
          102: "6",
          103: "7",
          104: "8",
          105: "9"
        };
      if (o.options.liveSearch && (n = m.parent().parent()), o.options.container && (n = o.$menu), d = a("[role=menu] li a", n), l = o.$menu.parent().hasClass("open"), !l && /([0-9]|[A-z])/.test(String.fromCharCode(c.keyCode)) && (o.options.container ? o.$newElement.trigger("click") : (o.setSize(), o.$menu.parent().addClass("open"), l = !0), o.$searchbox.focus()), o.options.liveSearch && (/(^9$|27)/.test(c.keyCode.toString(10)) && l && 0 === o.$menu.find(".active").length && (c.preventDefault(), o.$menu.parent().removeClass("open"), o.$button.focus()), d = a("[role=menu] li:not(.divider):not(.dropdown-header):visible a", n), m.val() || /(38|40)/.test(c.keyCode.toString(10)) || 0 === d.filter(".active").length && (d = o.$newElement.find("li a"), d = d.filter(o.options.liveSearchNormalize ? ":a" + o._searchStyle() + "(" + b(p[c.keyCode]) + ")" : ":" + o._searchStyle() + "(" + p[c.keyCode] + ")"))), d.length) {
        if (/(38|40)/.test(c.keyCode.toString(10))) e = d.index(d.filter(":focus")), g = d.parent(":not(.disabled):visible").first().index(), h = d.parent(":not(.disabled):visible").last().index(), f = d.eq(e).parent().nextAll(":not(.disabled):visible").eq(0).index(), i = d.eq(e).parent().prevAll(":not(.disabled):visible").eq(0).index(), j = d.eq(f).parent().prevAll(":not(.disabled):visible").eq(0).index(), o.options.liveSearch && (d.each(function(b) {
          a(this).hasClass("disabled") || a(this).data("index", b)
        }), e = d.index(d.filter(".active")), g = d.filter(":not(.disabled):visible").first().data("index"), h = d.filter(":not(.disabled):visible").last().data("index"), f = d.eq(e).nextAll(":not(.disabled):visible").eq(0).data("index"), i = d.eq(e).prevAll(":not(.disabled):visible").eq(0).data("index"), j = d.eq(f).prevAll(":not(.disabled):visible").eq(0).data("index")), k = m.data("prevIndex"), 38 == c.keyCode ? (o.options.liveSearch && (e -= 1), e != j && e > i && (e = i), g > e && (e = g), e == k && (e = h)) : 40 == c.keyCode && (o.options.liveSearch && (e += 1), -1 == e && (e = 0), e != j && f > e && (e = f), e > h && (e = h), e == k && (e = g)), m.data("prevIndex", e), o.options.liveSearch ? (c.preventDefault(), m.hasClass("dropdown-toggle") || (d.removeClass("active"), d.eq(e).addClass("active").children("a").focus(), m.focus())) : d.eq(e).focus();
        else if (!m.is("input")) {
          var q, r, s = [];
          d.each(function() {
            a(this).parent().hasClass("disabled") || a.trim(a(this).text().toLowerCase()).substring(0, 1) == p[c.keyCode] && s.push(a(this).parent().index())
          }), q = a(document).data("keycount"), q++, a(document).data("keycount", q), r = a.trim(a(":focus").text().toLowerCase()).substring(0, 1), r != p[c.keyCode] ? (q = 1, a(document).data("keycount", q)) : q >= s.length && (a(document).data("keycount", 0), q > s.length && (q = 1)), d.eq(s[q - 1]).focus()
        }
        if ((/(13|32)/.test(c.keyCode.toString(10)) || /(^9$)/.test(c.keyCode.toString(10)) && o.options.selectOnTab) && l) {
          if (/(32)/.test(c.keyCode.toString(10)) || c.preventDefault(), o.options.liveSearch) /(32)/.test(c.keyCode.toString(10)) || (o.$menu.find(".active a").click(), m.focus());
          else {
            var t = a(":focus");
            t.click(), t.focus(), c.preventDefault()
          }
          a(document).data("keycount", 0)
        }(/(^9$|27)/.test(c.keyCode.toString(10)) && l && (o.multiple || o.options.liveSearch) || /(27)/.test(c.keyCode.toString(10)) && !l) && (o.$menu.parent().removeClass("open"), o.$button.focus())
      }
    },
    mobile: function() {
      this.$element.addClass("mobile-device").appendTo(this.$newElement), this.options.container && this.$menu.hide()
    },
    refresh: function() {
      this.$lis = null, this.reloadLi(), this.render(), this.setWidth(), this.setStyle(), this.checkDisabled(), this.liHeight()
    },
    hide: function() {
      this.$newElement.hide()
    },
    show: function() {
      this.$newElement.show()
    },
    remove: function() {
      this.$newElement.remove(), this.$element.remove()
    }
  };
  var f = a.fn.selectpicker;
  a.fn.selectpicker = d, a.fn.selectpicker.Constructor = e, a.fn.selectpicker.noConflict = function() {
    return a.fn.selectpicker = f, this
  }, a(document).data("keycount", 0).on("keydown", ".bootstrap-select [data-toggle=dropdown], .bootstrap-select [role=menu], .bs-searchbox input", e.prototype.keydown).on("focusin.modal", ".bootstrap-select [data-toggle=dropdown], .bootstrap-select [role=menu], .bs-searchbox input", function(a) {
    a.stopPropagation()
  }), a(window).on("load.bs.select.data-api", function() {
    a(".selectpicker").each(function() {
      var b = a(this);
      d.call(b, b.data())
    })
  })
}(jQuery);
//# sourceMappingURL=bootstrap-select.js.map
