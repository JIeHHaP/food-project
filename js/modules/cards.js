function cards() {
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
}

export default cards;
