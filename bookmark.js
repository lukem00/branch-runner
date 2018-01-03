(function() {
    var u = 'http://localhost:3000/start',
        d = document,
        w = window,
        l = w.location,
        h = l.href.match(/^https?:\/\/.*?\//),
        e = encodeURIComponent,
        n = '',
        s = '' + (w.getSelection ? w.getSelection() : d.getSelection ? d.getSelection() : d.selection ? d.selection.createRange().text : '');
    if (s) n = s;

    /* TODO: make sure we're on a correct page to run a branch */
    if (h) h = h[0]; else h = '';
    
    console.log('baseUrl: ' + h);
    
    var $branch = d.querySelector('.commit-ref.head-ref > span');
    console.log($branch);  

    $branch.style.outline = 'red 1px solid';

    var $div = d.createElement('div');
    $div.innerHTML = '<a style="color: #fff; font-size: 12px;" href="#">Run branch</a>';
    var ds = $div.style;
    ds.background = '#1d1d1d';
    ds.color = '#fff';
    ds.padding = '5px 7px';
    ds['border-radius'] = '5px';
    ds.position = 'absolute';
    ds['min-width'] = '50px';
    ds['max-width'] = '300px';
    $branch.appendChild($div);
    d.querySelector('.commit-ref.head-ref > span div').addEventListener('click', function() {
        console.log(href);
        $branch.removeChild($div);
        l.href = href;
    }, false);

    var branch = d.querySelector('.commit-ref.head-ref > span').textContent;
    console.log(branch);

    var href = (u + '?v=1' + 
        '&h=' + e(l.href) +
        '&b=' + e(branch) +
        '&i=' + e(h) + 
        '&d=' + e(n)
    ).substring(0, navigator.userAgent.match(/MSIE/) ? 2080 : 4000);
    console.log(href);

    /* l.href = href; */

})()