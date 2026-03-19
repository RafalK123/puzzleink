document.addEventListener("DOMContentLoaded", function () {
  // ===== MODAL =====
  const modal = document.getElementById('book-modal');
  const slidesContainer = document.getElementById('modal-slides-container');
  let currentSlide = 0;
  let slides = [];

  document.querySelectorAll('.open-gallery').forEach(card => {
    card.addEventListener('click', () => {
      slidesContainer.innerHTML = card.querySelector('.hidden-gallery').innerHTML;
      slides = slidesContainer.querySelectorAll('.modal-slide');
      modal.style.display = 'flex';
      showSlide(0);
    });
  });

  function showSlide(n) {
    if (!slides.length) return;
    if (n < 0) n = slides.length - 1;
    if (n >= slides.length) n = 0;
    slides.forEach(s => s.style.display = 'none');
    slides[n].style.display = 'block';
    currentSlide = n;
  }

  modal.querySelector('.prev-slide').onclick = () => showSlide(currentSlide - 1);
  modal.querySelector('.next-slide').onclick = () => showSlide(currentSlide + 1);

  const closeModal = () => {
    modal.style.display = 'none';
    slidesContainer.innerHTML = '';
  };

  modal.querySelector('.modal-close').onclick = closeModal;
  modal.onclick = e => { if (e.target === modal) closeModal(); };
  document.addEventListener('keydown', e => {
    if (modal.style.display !== 'flex') return;
    if (e.key === 'ArrowLeft') showSlide(currentSlide - 1);
    if (e.key === 'ArrowRight') showSlide(currentSlide + 1);
    if (e.key === 'Escape') closeModal();
  });
  document.addEventListener("contextmenu", e => { if (e.target.tagName === "IMG") e.preventDefault(); });

  // ===== FILTRY =====
  const filterBtns = document.querySelectorAll('.filter-btn');
  const subFilterBlocks = document.querySelectorAll('.sub-filters');
  const subSubFilterBlocks = document.querySelectorAll('.sub-sub-filters');
  const bookCards = document.querySelectorAll('.book-card');

  // ===== Funkcja aktywacji głównego filtra =====
  function activateFilter(filter) {
    // aktywne główne filtry
    filterBtns.forEach(b => b.classList.toggle('active', b.dataset.filter === filter));

    // ukryj wszystkie sub-subfiltry przy zmianie kategorii
    subSubFilterBlocks.forEach(sb => {
      sb.style.display = 'none';
      sb.querySelectorAll('.sub-sub-filter-btn').forEach(b => b.classList.remove('active'));
    });

    if (filter === 'all') {
      // wszystkie książki
      bookCards.forEach(c => c.style.display = '');
      // ukryj wszystkie sub/sub-sub
      subFilterBlocks.forEach(sb => sb.style.display = 'none');
      subSubFilterBlocks.forEach(ssb => ssb.style.display = 'none');
      return;
    }

    if (filter === 'coming-soon') {
      // pokaż tylko książki z data-sub="soon"
      bookCards.forEach(c => {
        c.style.display = (c.dataset.sub === 'soon') ? '' : 'none';
      });
      // ukryj sub/sub-sub
      subFilterBlocks.forEach(sb => sb.style.display = 'none');
      subSubFilterBlocks.forEach(ssb => ssb.style.display = 'none');
      return;
    }

    // normalne Kids / Adults
    subFilterBlocks.forEach(block => {
      if (block.dataset.parent === filter) {
        block.style.display = 'flex';
        const allSub = block.querySelector('.sub-filter-btn[data-sub="all"]');
        if (allSub) allSub.click();
      } else {
        block.style.display = 'none';
        block.querySelectorAll('.sub-filter-btn').forEach(sf => sf.classList.remove('active'));
      }
    });

    // pokaż książki w kategorii
    bookCards.forEach(c => {
      c.style.display = (c.dataset.category === filter) ? '' : 'none';
    });
  }

  // Kliknięcie głównego filtra
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => activateFilter(btn.dataset.filter));
  });

  // ===== Subfiltry =====
  document.querySelectorAll('.sub-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const parentBlock = btn.closest('.sub-filters');
      const parentCategory = parentBlock.dataset.parent;
      const sub = btn.dataset.sub;

      // toggle odkliknięcia subfiltra (poza All)
      if (btn.classList.contains('active') && sub !== 'all') {
        btn.classList.remove('active');
        // pokaż wszystkie książki w kategorii
        bookCards.forEach(c => {
          c.style.display = (c.dataset.category === parentCategory) ? '' : 'none';
        });
        // ukryj sub-subfiltry
        subSubFilterBlocks.forEach(sb => { if (sb.dataset.parent === parentCategory) sb.style.display = 'none'; });
        return;
      }

      // aktywuj kliknięty subfiltr
      parentBlock.querySelectorAll('.sub-filter-btn').forEach(sf => sf.classList.remove('active'));
      btn.classList.add('active');

      // filtruj książki dla All lub konkretnego sub
      if (sub === 'all') {
        bookCards.forEach(c => { c.style.display = (c.dataset.category === parentCategory) ? '' : 'none'; });
        // ukryj wszystkie sub-subfiltry dla tej kategorii
        subSubFilterBlocks.forEach(sb => { if (sb.dataset.parent === parentCategory) sb.style.display = 'none'; });
      } else {
        // pokaż książki w kategorii i sub
        bookCards.forEach(c => {
          c.style.display = (c.dataset.category === parentCategory && c.dataset.sub === sub) ? '' : 'none';
        });
        // pokaż odpowiedni sub-subfiltr
        subSubFilterBlocks.forEach(sb => {
          sb.style.display = (sb.dataset.parent === parentCategory && sb.dataset.super === sub) ? 'flex' : 'none';
          sb.querySelectorAll('.sub-sub-filter-btn').forEach(ssf => ssf.classList.remove('active'));
          // automatycznie kliknij All w sub-sub (jeśli istnieje)
          const allSubSub = sb.querySelector('.sub-sub-filter-btn[data-subsub="all"]');
          if (allSubSub) allSubSub.click();
        });
      }
    });
  });

  // ===== Sub-subfiltry =====
  document.querySelectorAll('.sub-sub-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const parentBlock = btn.closest('.sub-sub-filters');
      const parentCategory = parentBlock.dataset.parent;
      const parentSub = parentBlock.dataset.super;
      const subsub = btn.dataset.subsub;

      // toggle odkliknięcia sub-subfiltra (poza All)
      if (btn.classList.contains('active') && subsub !== 'all') {
        btn.classList.remove('active');
        bookCards.forEach(c => {
          c.style.display = (c.dataset.category === parentCategory && c.dataset.sub === parentSub) ? '' : 'none';
        });
        return;
      }

      // aktywacja klikniętego sub-subfiltra
      parentBlock.querySelectorAll('.sub-sub-filter-btn').forEach(ssf => ssf.classList.remove('active'));
      btn.classList.add('active');

      if (subsub === 'all') {
        bookCards.forEach(c => {
          c.style.display = (c.dataset.category === parentCategory && c.dataset.sub === parentSub) ? '' : 'none';
        });
      } else {
        bookCards.forEach(c => {
          const subsubs = (c.dataset.subsub || "").split(',').map(s => s.trim());

          c.style.display = (
            c.dataset.category === parentCategory &&
            c.dataset.sub === parentSub &&
            subsubs.includes(subsub)
          ) ? '' : 'none';
        });
      }
    });
  });

  // ===== Automatyczne włączenie All Books przy wejściu na stronę główną =====
  const allBooksBtn = document.querySelector('.filter-btn.all-btn[data-filter="all"]');
  if (allBooksBtn) allBooksBtn.click();
});