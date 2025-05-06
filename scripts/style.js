function doTabulatorThings() {
  window.$table = new Tabulator('table[name="software_list"]', {
    layout:"fitColumns",
    columns: [
        {
            title: "Software",
            formatter: "html"
        }, {
            title: "Audience"
        }, {
            title: "Description"
        }
    ]
  });
};

jQuery(document).ready(function() {
  $('head').append('<link rel="stylesheet" type="text/css" href="https://takuy.github.io/tdx-scripts/style/style.css">');
  $('head').append('<link rel="stylesheet" type="text/css" href="https://unpkg.com/tabulator-tables@6.3.1/dist/css/tabulator_bootstrap3.min.css">');
  $.getScript("https://unpkg.com/tabulator-tables@6.3/dist/js/tabulator.min.js", function() { doTabulatorThings() } );

});
