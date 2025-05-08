function doTabulatorThings() {
    window.$table = new Tabulator('table[name="software_list"]', {
        layout:"fitColumns",
        columns: [
            {
                title: "",
                field: "Cost",
                formatter: function() {
                    return "💰";
                }, hozAlign: "center", width: 40
            },
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
    $('head').append('<link rel="stylesheet" type="text/css" href="https://unpkg.com/tabulator-tables@6.3.1/dist/css/tabulator_bootstrap3.min.css">');
    $('head').append('<link rel="stylesheet" type="text/css" href="https://takuy.github.io/tdx-scripts/style/style.css">');
    
    doTabulatorThings();

    jQuery(document, 'div[name="role-filter"] input:checked').on('change', function() {
    let roles = jQuery('div[name="role-filter"] input:checked').map(function() { return $(this).val();}).get();
    $('span[name="software-filter-list"]').text(roles.length > 0 ? roles.join(", ") : $('span[name="software-filter-list"]').data("default") );
        $table.setFilter(function(data, params) {
            let match = data["audience"].split(", ").some(r=> params.roles.includes(r));
            return params.roles.length > 0 ? match : 1;
        }, {roles: roles});
    });
  
});
