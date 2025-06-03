function tabulatorSoftwareTable() {
    window.$table = new Tabulator('table[name="software_list"]', {
        layout:"fitDataStretch",
        pagination:true,
        paginationSize:10,
        paginationSizeSelector:[5, 10, 25, 50, 100, true],
        paginationCounter: "rows",
        columns: [
            {
                title: "Cost",
                formatter: function(cell) {
                    return cell.getValue() == "$" ? "<span role='img' title='There is a cost associated with this software.'>💲</span>" : "";
                }, hozAlign: "center", width: 40, resizable: false,
                titleFormatter: function() {
                    return "&nbsp;";
                }
            }, {
                title: "SoftwareLink", resizable: false,
                formatter: "html", visible: false
            }, {
                field: "softwaretitle", title: "Software", resizable: false, formatter: "link", formatterParams: {
                  target: "_blank",
                  url: function(cell) {
                    return cell.getRow().getData()["servicelink"];
                  },
                  label: function(cell) { 
                    return cell.getRow().getData()["softwaretitle"];
                  }
                }
            }, {
                title: "ServiceLink", resizable: false, visible: false
            }, {
                title: "SoftwareTitle", resizable: false, visible: false, formatter: "html"
            }, {
                title: "Category", resizable: false
            }, {
                title: "Audience", resizable: false
            }, {
                title: "Platform", resizable: false
            }, {
                title: "Description", resizable: false, visible: false
            }
        ]
    });   

    // make the table page full width
    $('#divMainContent').addClass('col-12').removeClass("col-md-8");
    //$('#divMainContent + div.col-md-4').hide();
    
    $('select[name="role-filter"], select[name="platform-filter"], select[name="category-filter"]').each(function() {
        $(this).attr('id', $(this).attr('name'));
        $(this).select2({
            placeholder: 'Click to select', 
            allowClear: true, width: "200px"
        });
    });

    $('button[name="filter-reset"]').click(function(event) {
        event.preventDefault();
        event.stopPropagation();
        $('select[name="role-filter"], select[name="platform-filter"], select[name="category-filter"]').val(null).trigger('change');
        $('input[name="software-search"]').val(null);
        updateSoftwareFilter();
    });

    $(document, 'select[name="role-filter"], select[name="platform-filter"], select[name="category-filter"]').on('change.select2 select2:select select2:clear', function() {
        updateSoftwareFilter();
    });

    document.querySelector('input[name="software-search"]').addEventListener("keyup", updateSoftwareFilter);
    $('input[name="software-search"]').attr('id', $('input[name="software-search"]').attr('name'));
}

var tdx_utils = {
    setFilterDescription: function(array, selector) {
        $(selector).text(array.length > 0 ? array.join(", ") : $(selector).data("default") );
    },
    getSelectedItems: function(selector) {
        return $(selector).select2('data').map(function(t) { return t.id });
    },
    hasFilterMatch: function(selected, data) {
        return (selected.length) > 0 ? data.split(", ").some(r=> selected.includes(r)) : 1;
    }
};

function updateSoftwareFilter() {
    let filterableItems = [{ 
            "column": "audience",
            "filter": "role",
        }, { 
            "column": "platform",  
            "filter": "platform", 
        }, { 
            "column": "category",
            "filter": "category" 
        }
    ];
    filterableItems.forEach(function(t) {
        let filterSelector = `select[name="${t.filter}-filter"]`;
        let filterDescriber = `span[name="filtered-${t.filter}"]`;
        t.selector = filterSelector;
        t.describer = filterDescriber;

        // array of selected items
        let selected = tdx_utils.getSelectedItems(filterSelector);
        tdx_utils.setFilterDescription(selected, filterDescriber);
        t.selected = selected;
    });

    /*
    let roles = $('select[name="role-filter"]').select2('data').map(function(t) { return t.id });
    let platforms = $('select[name="platform-filter"]').select2('data').map(function(t) { return t.id });
    let categories = $('select[name="category-filter"]').select2('data').map(function(t) { return t.id });
    $('span[name="filtered-role"]').text(roles.length > 0 ? roles.join(", ") : $('span[name="filtered-role"]').data("default") );
    $('span[name="filtered-category"]').text(categories.length > 0 ? categories.join(", ") : $('span[name="filtered-category"]').data("default") );
    $('span[name="filtered-platform"]').text(platforms.length > 0 ? platforms.join(", ") : $('span[name="filtered-platform"]').data("default") );
    */

    let filterText = jQuery('input[name="software-search"]').val();

    $table.setFilter(function(data, params) {
        let hasFilterablesMatch = true;
        params.filterables.forEach(function(t) {
            console.log(t.selected, data[t.column], tdx_utils.hasFilterMatch(t.selected, data[t.column]));
            hasFilterablesMatch &= tdx_utils.hasFilterMatch(t.selected, data[t.column]);
        });
      
        let hasTextMatch = false;
        if (params.filterText) {
            for (prop in data) {
                if(prop == "id") { continue; }
                if (data[prop] && data[prop].toLowerCase().indexOf(params.filterText.toLowerCase()) > -1) {
                    hasTextMatch |= true;
                }
            }
        } else {
            hasTextMatch = true;
        }
      
        return hasFilterablesMatch && hasTextMatch;
    }, { filterables: filterableItems , filterText: filterText});
}

function tabulatorGroupTable() {
    window.$table = new Tabulator('table[name="group-table"]', {
        layout:"fitDataStretch",
        columns: [
            {
                title: "Helix Support Group", resizable: false, formatter: "html",
                headerFilter: "input", headerFilterPlaceholder: "Type to filter..."
            }, {
                title: "TDX Group Name", resizable: false, formatter: "html",
                headerFilter: "input", headerFilterPlaceholder: "Type to filter..."
            }
        ]
    });   

    $('#divMainContent').addClass('col-12').removeClass("col-md-8");

    document.querySelector('input[name="software-search"]').addEventListener("keyup", updateSoftwareFilter);
}

function updateGroupTableFilter() {
    let filterText = jQuery('input[name="group-search"]').val();  
    $table.setFilter(function(data, params) {
        let hasTextMatch = false;
        if (params.filterText) {
            for (prop in data) {
                if(prop == "id") { continue; }
                if (data[prop] && data[prop].toLowerCase().indexOf(params.filterText.toLowerCase()) > -1) {
                    hasTextMatch |= true;
                }
            }
        } else {
            hasTextMatch = true;
        }
      
        return  hasTextMatch;
    }, {filterText: filterText});
}

jQuery(document).ready(function() {
    $('head').append('<link rel="stylesheet" type="text/css" href="https://takuy.github.io/tdx-scripts/style/style.css">');
    $('head').append('<link rel="stylesheet" type="text/css" href="https://unpkg.com/tabulator-tables@6.3.1/dist/css/tabulator_bootstrap3.min.css">');
   // $('head').append('<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css">');
    if(jQuery('#divAttachments .js-attachments-body').data('attachmentsCount') == 0) {
        jQuery('#divAttachments').hide();
    }
    
    if(jQuery('table[name="software_list"]').length) {
        tabulatorSoftwareTable();
    }

    if(jQuery('table[name="group-table"]').length) {
        tabulatorGroupTable();
    }
    
    if(jQuery('table.simple-tabulator').length) {
        var toTabulatorify = jQuery('table.simple-tabulator');
        toTabulatorify.each(function() {
            if ($(toTabulatorify).hasClass("tbl-full-width")) {
                $('#divMainContent').addClass('col-12').removeClass("col-md-8");
            } 
            if ($(toTabulatorify).hasClass("hide-sidebar")) {
                $('#divMainContent + div.col-md-4').hide();
            }
            new Tabulator(this, {
                layout:"fitData"
            });
        });
    }
    
});
