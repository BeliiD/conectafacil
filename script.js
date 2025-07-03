document.addEventListener('DOMContentLoaded', () => {

    const vlibrasButton = document.querySelector('.vlibras-button');

    if (vlibrasButton) {

        vlibrasButton.addEventListener('click', () => {

            alert('O botão Vlibras foi clicado! Aqui você poderia integrar a funcionalidade.');
        });

    }

});

class MobileNavbar {
    constructor(mobileMenu, navList, navLinks) {
        this.mobileMenu = document.querySelector(mobileMenu);
        this.navList = document.querySelector(navList);
        this.navLinks = document.querySelectorAll(navLinks);
        this.activeClass = "active";

        this.handleClick = this.handleClick.bind(this);
        this.handleKeydown = this.handleKeydown.bind(this);
    }

    animateLinks() {
        this.navLinks.forEach((link, index) => {
            link.style.animation
                ? (link.style.animation = "")
                : (link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3
                    }s`);
        });
    }

    handleClick() {
        this.navList.classList.toggle(this.activeClass);
        this.mobileMenu.classList.toggle(this.activeClass);
        this.animateLinks();
    }

    handleKeydown(event) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault(); // evita scroll se for barra de espaço
            this.handleClick();
        }
    }

    addClickEvent() {
        this.mobileMenu.addEventListener("click", this.handleClick);
        this.mobileMenu.addEventListener("keydown", this.handleKeydown);
    }

    init() {
        if (this.mobileMenu) {
            this.addClickEvent();
        }
        return this;
    }
}

const mobileNavbar = new MobileNavbar(
    ".mobile-menu",
    ".nav-list",
    ".nav-list li",
);
mobileNavbar.init();

const searchInput = document.getElementById('search-bar');

if (searchInput) {
  searchInput.addEventListener('input', (event) => {
    const value = formatString(event.target.value);

    const itens = document.querySelectorAll("#modulos-list .modulos-item");
    const lista = document.getElementById('modulos-list');

    if (value != '') {
      itens.forEach(item => {
        if (formatString(item.textContent).indexOf(value) !== -1) {
          item.style.display = 'flex';
          lista.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
    } else {
      lista.style.display = 'none';
    }
  });
}


function formatString(value) {
    return value.toLowerCase().trim();
}

//Scroll para o topo da página
const backToTopButton = document.querySelector('.back-to-top')

const backToTop = () => {
    if (window.scrollY >= 100) {
        backToTopButton.classList.add('show')
    } else {
        backToTopButton.classList.remove('show')
    }
}

window.addEventListener('scroll', function () {
    backToTop()
});

const imagens = [
  'img/img1.png',
  'img/img2.png',
  'img/img3.png',
  'img/img4.png',
  'img/img5.png',
  'img/img6.png',
  'img/img7.png',
  'img/img8.png'
];

let indiceAtual = 0;

function mostrarImagem() {
  const img = document.getElementById('carousel-img');
  if (img) {
    img.src = imagens[indiceAtual];
  }
}

window.nextSlide = function () {
  indiceAtual = (indiceAtual + 1) % imagens.length;
  mostrarImagem();
};

window.prevSlide = function () {
  indiceAtual = (indiceAtual - 1 + imagens.length) % imagens.length;
  mostrarImagem();
};

document.addEventListener('DOMContentLoaded', mostrarImagem);
