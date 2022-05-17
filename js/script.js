/*jshint esversion: 8 */

window.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".tabheader__item"),
    tabsContent = document.querySelectorAll(".tabcontent"),
    tabsParent = document.querySelector(".tabheader__items");

  // Tabs
  function hideTabContent() {
    tabsContent.forEach((item) => {
      item.style.display = "none";
      item.classList.remove("fade");
    });

    tabs.forEach((item) => {
      item.classList.remove("tabheader__item_active");
    });
  }

  function showTabContent(i = 0) {
    tabsContent[i].style.display = "block";
    tabsContent[i].classList.add("fade");
    tabs[i].classList.add("tabheader__item_active");
  }

  hideTabContent();
  showTabContent();

  tabsParent.addEventListener("click", (event) => {
    const target = event.target;

    if (target && target.classList.contains("tabheader__item")) {
      tabs.forEach((item, i) => {
        if (target == item) {
          hideTabContent();
          showTabContent(i);
        }
      });
    }
  });

  // Timer

  const deadLine = "2022-05-25";

  function getTimeRemaining(endtime) {
    const t = Date.parse(endtime) - Date.parse(new Date()),
      days = Math.floor(t / (1000 * 60 * 60 * 24)),
      hours = Math.floor((t / (1000 * 60 * 60)) % 24),
      minutes = Math.floor((t / 1000 / 60) % 60),
      seconds = Math.floor((t / 1000) % 60);

    return {
      total: t,
      days: days,
      hours: hours,
      minutes: minutes,
      seconds: seconds,
    };
  }

  function getZero(num) {
    if (num >= 0 && num < 10) {
      return `0${num}`;
    } else {
      return num;
    }
  }

  function setClock(selector, endtime) {
    const timer = document.querySelector(selector),
      days = timer.querySelector("#days"),
      hours = timer.querySelector("#hours"),
      minutes = timer.querySelector("#minutes"),
      seconds = timer.querySelector("#seconds"),
      timeInterval = setInterval(updateClock, 1000);

    updateClock();

    function updateClock() {
      const t = getTimeRemaining(endtime);

      days.textContent = getZero(t.days);
      hours.textContent = getZero(t.hours);
      minutes.textContent = getZero(t.minutes);
      seconds.textContent = getZero(t.seconds);

      if (t.total <= 0) {
        clearInterval(timeInterval);
      }
    }
  }

  setClock(".timer", deadLine);

  //modal

  const modalBtn = document.querySelectorAll("[data-modal]"),
    modal = document.querySelector(".modal");

  function openModal() {
    modal.classList.add("show");
    document.body.style.overflow = "hidden";
    clearInterval(modalTimerId);
  }

  function closeModal() {
    modal.classList.remove("show");
    document.body.style.overflow = "";
  }

  modalBtn.forEach((item) => {
    item.addEventListener("click", openModal);
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal || e.target.getAttribute("data-close") == "") {
      closeModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.code === "Escape" && modal.classList.contains("show")) {
      closeModal();
    }
  });

  const modalTimerId = setTimeout(openModal, 50000);

  function showModalByScroll() {
    if (
      window.pageYOffset + document.documentElement.clientHeight >=
      document.documentElement.scrollHeight
    ) {
      openModal();
      window.removeEventListener("scroll", showModalByScroll);
    }
  }

  window.addEventListener("scroll", showModalByScroll);

  class MenuCard {
    constructor(src, alt, title, discr, prise, selector) {
      this.src = src;
      this.alt = alt;
      this.title = title;
      this.discr = discr;
      this.prise = prise;
      this.changeRate = 75;
      this.selector = document.querySelector(selector);
      this.changeToRUB();
    }

    changeToRUB() {
      this.prise = this.prise * this.changeRate;
    }

    render() {
      const element = document.createElement("div");
      element.innerHTML = `<div class="menu__item">
    <img src=${this.src} alt=${this.alt} />
    <h3 class="menu__item-subtitle">${this.title}</h3>
    <div class="menu__item-descr">
      ${this.discr}
    </div>
    <div class="menu__item-divider"></div>
    <div class="menu__item-price">
      <div class="menu__item-cost">Цена:</div>
      <div class="menu__item-total"><span>${this.prise}</span> руб/день</div>
    </div>
  </div>`;

      this.selector.append(element);
    }
  }

  const getResource = async (url) => {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, status ${$res.status}`);
    }

    return await res.json();
  };

  getResource("http://localhost:3000/menu").then((data) => {
    data.forEach(({ img, altimg, title, descr, price }) => {
      new MenuCard(
        img,
        altimg,
        title,
        descr,
        price,
        ".menu .container"
      ).render();
    });
  });

  //forms

  const forms = document.querySelectorAll("form"),
    message = {
      loading: "img/form/spinner.svg",
      success: "Спасибо! Мы скоро с вами свяжемся.",
      failure: "Что-то пошло не так...",
    };

  forms.forEach((item) => {
    bindPostData(item);
  });

  const postData = async (url, data) => {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: data,
    });
    return await res.json();
  };

  function bindPostData(form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const statusMessage = document.createElement("img");
      statusMessage.src = message.loading;
      statusMessage.style.cssText = `
      display: block;
      margin: 0 auto;
      `;

      form.insertAdjacentElement("afterend", statusMessage);

      const formData = new FormData(form);

      const json = JSON.stringify(Object.fromEntries(formData.entries()));

      postData("http://localhost:3000/requests", json)
        .then((data) => {
          console.log(data);
          showThanksModal(message.success);
          statusMessage.remove();
        })
        .catch(() => {
          showThanksModal(message.failure);
        })
        .finally(() => {
          form.reset();
        });
    });
  }

  function showThanksModal(message) {
    const prevModalDialog = document.querySelector(".modal__dialog");

    prevModalDialog.classList.toggle("hide");
    openModal();

    const thanksModal = document.createElement("div");
    thanksModal.classList.add("modal__dialog");
    thanksModal.innerHTML = `
      <div class="modal__content">
      <div class="modal__close" data-close>×</div>
      <div class="modal__title">${message}</div>
      </div>
    `;

    document.querySelector(".modal").append(thanksModal);

    setTimeout(() => {
      thanksModal.remove();
      prevModalDialog.classList.toggle("show");
      prevModalDialog.classList.toggle("hide");
      closeModal();
    }, 3000);
  }

  // Slider

  const slides = document.querySelectorAll(".offer__slide"),
    slider = document.querySelector(".offer__slider"),
    next = document.querySelector(".offer__slider-next"),
    prev = document.querySelector(".offer__slider-prev"),
    current = document.querySelector("#current"),
    total = document.querySelector("#total"),
    slidesWrapper = document.querySelector(".offer__slider-wrapper"),
    slidesField = document.querySelector(".offer__slider-inner"),
    width = window.getComputedStyle(slidesWrapper).width;

  const indicators = document.createElement("ol"),
    dots = [];

  function showActiveIndicator() {
    dots.forEach((dot) => {
      dot.classList.remove("dot-active");
      dots[slideIndex - 1].classList.add("dot-active");
    });
  }

  function showCurrentSlide() {
    if (slideIndex < 10) {
      current.textContent = `0${slideIndex}`;
    } else {
      current.textContent = slideIndex;
    }
  }

  function showSelectedSlide(length, className) {
    if (className == "offer__slider-next" || className == "slide-right") {
      if (offset == deleteNotDigits(width) * (length - 1)) {
        offset = 0;
      } else {
        offset += deleteNotDigits(width);
      }
      if (slideIndex == slides.length) {
        slideIndex = 1;
      } else {
        slideIndex++;
      }
    } else if (className == "offer__slider-prev" || className == "slide-left") {
      if (offset == 0) {
        offset = deleteNotDigits(width) * (length - 1);
      } else {
        offset -= deleteNotDigits(width);
      }
      if (slideIndex == 1) {
        slideIndex = slides.length;
      } else {
        slideIndex--;
      }
    } else if (className == "dot") {
      offset = deleteNotDigits(width) * (length - 1);
    }
    slidesField.style.transform = `translateX(-${offset}px)`;
  }

  function deleteNotDigits(str) {
    return +str.replace(/\D/g, "");
  }

  indicators.classList.add("carousel-indicators");
  slider.append(indicators);

  slides.forEach((item, i) => {
    const dot = document.createElement("li");
    dot.setAttribute("data-slide-to", i + 1);
    dot.classList.add("dot");
    indicators.append(dot);
    dots.push(dot);
    if (i == 0) {
      dot.classList.add("dot-active");
    }
  });

  let slideIndex = 1;
  let offset = 0;

  if (slides.length < 10) {
    total.textContent = `0${slides.length}`;
    current.textContent = `0${slideIndex}`;
  } else {
    total.textContent = slides.length;
    current.textContent = slideIndex;
  }

  slidesField.style.cssText = `display: flex; transition: 0.5s all; width: ${
    100 * slides.length
  }%`;

  slidesWrapper.style.overflow = "hidden";

  slides.forEach((slide) => {
    slide.style.width = width;
  });

  next.addEventListener("click", (event) => {
    showSelectedSlide(slides.length, event.target.className);
    showCurrentSlide();
    showActiveIndicator();
  });

  prev.addEventListener("click", (event) => {
    showSelectedSlide(slides.length, event.target.className);
    showCurrentSlide();
    showActiveIndicator();
  });

  dots.forEach((dot) => {
    dot.addEventListener("click", (event) => {
      const slideTo = event.target.getAttribute("data-slide-to");
      slideIndex = slideTo;
      showSelectedSlide(slideTo, event.target.className);
      showCurrentSlide();
      showActiveIndicator();
    });
  });
});
