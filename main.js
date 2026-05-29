(function () {

    var header = document.getElementById('site_header');
    var burger = document.getElementById('header_burger');
    var dropdown = document.getElementById('header_dropdown');

    // Sticky shadow
    window.addEventListener('scroll', function () {
        header.classList.toggle('scrolled', window.scrollY > 20);
    });

    // Burger toggle
    burger.addEventListener('click', function () {
        var open = burger.classList.toggle('open');
        dropdown.classList.toggle('open', open);
    });

    // Close on any link inside dropdown
    dropdown.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            burger.classList.remove('open');
            dropdown.classList.remove('open');
        });
    });

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            var id = link.getAttribute('href');
            if (id === '#') return;
            var target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            var offset = header ? header.offsetHeight : 72;
            window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - offset, behavior: 'smooth' });
        });
    });

    // Scroll fade-in
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.fade_in').forEach(function (el) {
        observer.observe(el);
    });

    // File upload
    var fileInput = document.getElementById('f_file');
    var fileNames = document.getElementById('file_names');
    var fileDrop  = document.getElementById('file_drop');

    if (fileInput && fileNames) {
        fileInput.addEventListener('change', function () {
            var files = Array.from(fileInput.files);
            fileNames.textContent = files.length
                ? files.map(function (f) { return f.name; }).join(', ')
                : '';
        });
    }

    if (fileDrop) {
        fileDrop.addEventListener('dragover', function (e) {
            e.preventDefault();
            fileDrop.classList.add('drag_over');
        });
        fileDrop.addEventListener('dragleave', function () {
            fileDrop.classList.remove('drag_over');
        });
        fileDrop.addEventListener('drop', function (e) {
            e.preventDefault();
            fileDrop.classList.remove('drag_over');
            if (fileInput && e.dataTransfer.files.length) {
                fileInput.files = e.dataTransfer.files;
                fileInput.dispatchEvent(new Event('change'));
            }
        });
    }

    // Form validation
    var form = document.getElementById('request_form');
    if (!form) return;

    function setErr(fieldId, errId, msg) {
        var input = document.getElementById(fieldId);
        var err = document.getElementById(errId);
        if (err) err.textContent = msg;
        if (input) input.classList.toggle('error', !!msg);
    }

    function clearErrors() {
        [['f_name','err_name'],['f_company','err_company'],['f_phone','err_phone'],
         ['f_email','err_email'],['f_type','err_type'],['f_route','err_route'],
         ['f_cargo','err_cargo'],['f_weight','err_weight']
        ].forEach(function (p) { setErr(p[0], p[1], ''); });
    }

    form.addEventListener('submit', function (e) {
        clearErrors();
        var ok = true;
        var checks = [
            ['f_name',    'err_name',    'Укажите имя исполнителя'],
            ['f_company', 'err_company', 'Укажите наименование компании'],
            ['f_phone',   'err_phone',   'Укажите телефон для связи'],
            ['f_route',   'err_route',   'Укажите маршрут'],
            ['f_cargo',   'err_cargo',   'Укажите наименование груза'],
            ['f_weight',  'err_weight',  'Укажите вес брутто']
        ];

        checks.forEach(function (c) {
            if (!document.getElementById(c[0]).value.trim()) { setErr(c[0], c[1], c[2]); ok = false; }
        });

        var emailEl = document.getElementById('f_email');
        if (!emailEl.value.trim()) {
            setErr('f_email', 'err_email', 'Укажите email'); ok = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim())) {
            setErr('f_email', 'err_email', 'Введите корректный email'); ok = false;
        }

        var typeEl = document.getElementById('f_type');
        if (!typeEl.value) { setErr('f_type', 'err_type', 'Выберите тип перевозки'); ok = false; }

        if (!ok) {
            e.preventDefault();
            var firstErr = form.querySelector('.error');
            if (firstErr) window.scrollTo({ top: firstErr.getBoundingClientRect().top + window.pageYOffset - 120, behavior: 'smooth' });
        }
    });

    form.querySelectorAll('.form_input').forEach(function (input) {
        input.addEventListener('input', function () {
            input.classList.remove('error');
            var errId = 'err_' + input.id.replace('f_', '');
            var errEl = document.getElementById(errId);
            if (errEl) errEl.textContent = '';
        });
    });

}());
