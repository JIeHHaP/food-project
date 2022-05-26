function slider() {
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
}

export default slider;
