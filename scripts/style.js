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
                title: "Description", resizable: false
            }
        ]
      });
}

function updateFilter() {
    let roles = [];
    if(jQuery('select[name="role-filter"]').length) {
      roles = $('select[name="role-filter"]').select2('data').map(function(t) { return t.id });
    } else {
      roles = jQuery('div[name="role-filter"] input:checked').map(function() { return $(this).val();}).get();
    }
    let platforms = $('select[name="platform-filter"]').select2('data').map(function(t) { return t.id });
    let categories = $('select[name="category-filter"]').select2('data').map(function(t) { return t.id });
  
    let filterText = jQuery('input[name="software-search"]').val();
    
    $('span[name="filtered-role"]').text(roles.length > 0 ? roles.join(", ") : $('span[name="filtered-role"]').data("default") );
    $('span[name="filtered-category"]').text(categories.length > 0 ? categories.join(", ") : $('span[name="filtered-category"]').data("default") );
    $('span[name="filtered-platform"]').text(platforms.length > 0 ? platforms.join(", ") : $('span[name="filtered-platform"]').data("default") );
  
    $table.setFilter(function(data, params) {
        let hasRoleMatch = (params.roles.length) > 0 ? data["audience"].split(", ").some(r=> params.roles.includes(r)) : 1;
        let hasPlatformMatch = (params.platforms.length) > 0 ? data["platform"].split(", ").some(r=> params.platforms.includes(r)) : 1;
        let hasCategoryMatch = (params.categories.length) > 0 ? data["category"].split(", ").some(r=> params.categories.includes(r)) : 1;  
      
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
      
        return hasRoleMatch && hasPlatformMatch && hasCategoryMatch && hasTextMatch;
    }, {roles: roles,  platforms: platforms, categories: categories, filterText: filterText});
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

        // make the table page full width
        $('#divMainContent').addClass('col-12').removeClass("col-md-8");
        $('#divMainContent + div.col-md-4').hide();
        
      $('select[name="role-filter"], select[name="platform-filter"], select[name="category-filter"]').select2({
        placeholder: 'Click to select', 
        allowClear: true, width: "style"
      });
      
      if(jQuery('select[name="role-filter"]').length) {
        jQuery(document, 'select[name="role-filter"], select[name="platform-filter"], select[name="category-filter"]').on('select2:select select2:clear', function() {
            updateFilter();
        });
      } else {
        jQuery(document, 'div[name="role-filter"] input:checked').on('change', function() {
            updateFilter();
          });
      }

        document.querySelector('input[name="software-search"]').addEventListener("keyup", updateFilter);

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
