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
                            document.dispatchEvent(new Event('components-loaded'));
                        }
                    }
                };
                xhr.send();
            });
        })();