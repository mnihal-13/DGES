(function () {
    var components = [
        { id: 'header-placeholder', src: 'components/header.html' },
        { id: 'footer-placeholder', src: 'components/footer.html' }
    ];
    var loaded = 0;

    components.forEach(function (comp) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', comp.src, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 0) && xhr.responseText) {
                var el = document.getElementById(comp.id);
                if (el) el.innerHTML = xhr.responseText;
                loaded++;
                if (loaded === components.length) {
                    highlightActiveNav();
                    initScrollToTop();
                    document.dispatchEvent(new Event('components-loaded'));
                }
            }
        };
        xhr.send();
    });

    function highlightActiveNav() {
        var currentPage = window.location.pathname.split('/').pop() || 'index.html';
        if (currentPage === '') currentPage = 'index.html';
        var navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach(function (link) {
            var href = link.getAttribute('href');
            if (href === currentPage) {
                link.classList.add('active');
            }
        });
    }

    function initScrollToTop() {
        var btn = document.getElementById('scrollToTop');
        var ringFill = btn && btn.querySelector('.ring-fill');
        if (!btn || !ringFill) return;

        var circumference = 2 * Math.PI * 21; // r=21, circumference ≈ 131.95

        window.addEventListener('scroll', function () {
            var scrollTop = window.scrollY;
            var docHeight = document.documentElement.scrollHeight - window.innerHeight;
            var scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0;

            // Show/hide button
            if (scrollTop > 400) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
            }

            // Update progress ring
            var offset = circumference - (scrollPercent * circumference);
            ringFill.style.strokeDashoffset = offset;
        });

        // Click to scroll top
        btn.addEventListener('click', function () {
            if (typeof lenis !== 'undefined') {
                lenis.scrollTo(0);
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }
})();