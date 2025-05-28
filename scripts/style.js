function tabulatorSoftwareTable() {
    window.$table = new Tabulator('table[name="software_list"]', {
        layout:"fitColumns",
        pagination:true,
        paginationSize:10,
        paginationSizeSelector:[10, 25, 50, 100, true],
        columns: [
            {
                title: "Cost",
                formatter: function(cell) {
                    return cell.getValue() == "$" ? "<span role='img' title='There is a cost associated with this software.'>💸</span>" : "";
                }, hozAlign: "center", width: 40, resizable: false,
                titleFormatter: function() {
                    return "&nbsp;";
                }
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
}

function updateFilter() {
    let roles = jQuery('div[name="role-filter"] input:checked').map(function() { return $(this).val();}).get();
    let filterText = jQuery('input[name="software-search"]').val();
    
    $('span[name="software-filter-list"]').text(roles.length > 0 ? roles.join(", ") : $('span[name="software-filter-list"]').data("default") );
    
    $table.setFilter(function(data, params) {
        let hasRoleMatch = data["audience"].split(", ").some(r=> params.roles.includes(r));
        let considerRoleMatch = (params.roles.length) > 0 ? match : 1;

        let hasTextMatch = false;
        if (params.filterText) {
            for (prop in data) {
                if(prop == "id") {
                    continue;
                }
                console.log(data[prop]);
                if (data[prop] && data[prop].toLowerCase().indexOf(params.filterText.toLowerCase()) > -1) {
                    hasTextMatch |= true;
                }
            }
        } else {
            hasTextMatch = true;
        }
        return considerRoleMatch && hasTextMatch;
    }, {roles: roles, filterText: filterText});
}

jQuery(document).ready(function() {
    $('head').append('<link rel="stylesheet" type="text/css" href="https://unpkg.com/tabulator-tables@6.3.1/dist/css/tabulator_bootstrap3.min.css">');
    $('head').append('<link rel="stylesheet" type="text/css" href="https://takuy.github.io/tdx-scripts/style/style.css">');

    if(jQuery('table[name="software_list"]').length) {
        tabulatorSoftwareTable();
        
        document.querySelector('input[name="software-search"]').addEventListener("keyup", updateFilter);
        
        jQuery(document, 'div[name="role-filter"] input:checked').on('change', function() {
            updateFilter();
        });
    }

    if(jQuery('table.simple-tabulator').length) {
        var toTabulatorify = jQuery('table.simple-tabulator');
        toTabulatorify.each(function() {
            new Tabulator(this, {
                layout:"fitColumns"
          });
        });
    }
    
});
