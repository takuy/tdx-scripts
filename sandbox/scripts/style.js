function tabulatorSoftwareTable() {
    // make the table page full width
    $('#divMainContent').addClass('col-12').removeClass("col-md-8");
    //$('#divMainContent + div.col-md-4').hide();
    
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

    let allFilterableSelectors = [];
    let allFilterableSelectorsText = "";
    
    filterableItems.forEach(function(t) {
        let filterSelector = `select[name="${t.filter}-filter"]`;
        let filterDescriber = `span[name="filtered-${t.filter}"]`;
        t.selector = filterSelector;
        t.describer = filterDescriber;

        allFilterableSelectors.push(filterSelector);
        
        $(filterSelector).each(function() {
            $(this).attr('id', $(this).attr('name'));
            $(this).select2({
                placeholder: 'Click to select', 
                allowClear: true, width: "200px"
            });
        });
        
    });

    allFilterableSelectorsText = allFilterableSelectors.join(", ");

    $('button[name="filter-reset"]').click(function(event) {
        event.preventDefault();
        event.stopPropagation();
        $(allFilterableSelectorsText).val(null).trigger('change');
        $('input[name="software-search"]').val(null);
        updateSoftwareFilter(filterableItems);
    });

    $(document, allFilterableSelectorsText).on('change.select2 select2:select select2:clear', function() {
        updateSoftwareFilter(filterableItems);
    });

    document.querySelector('input[name="software-search"]').addEventListener("keyup", function() { 
        updateSoftwareFilter(filterableItems) 
    });
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
    },
    getAllSelectors: function(filterableItems) {
        return filterableItems.map((t) => t.selector);
    }
};

function updateSoftwareFilter(filterableItems) {
    filterableItems.forEach(function(t) {
        // array of selected items
        let selected = tdx_utils.getSelectedItems(t.selector);
        tdx_utils.setFilterDescription(selected, t.describer);
        t.selected = selected;
    });

    let filterText = jQuery('input[name="software-search"]').val();

    $table.setFilter(function(data, params) {
        let hasFilterablesMatch = true;
        params.filterables.forEach(function(t) {
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
    $('head').append('<link rel="stylesheet" type="text/css" href="https://takuy.github.io/tdx-scripts/sandbox/style/style.css">');
    $('head').append('<link rel="stylesheet" type="text/css" href="https://unpkg.com/tabulator-tables@6.3.1/dist/css/tabulator_bootstrap3.min.css">');
    $('head').append('<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/tocbot/4.34.0/tocbot.css">');
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
    

    $('h1,h2,h3,h4,h5').each(function() {
        if(!$(this).attr('id')) {
            let new_id_source = $(this).attr('name') || $(this).text();
            let new_id = new_id_source.trim().replaceAll(/[^A-Za-z0-9_-\w]/gm,'_').replaceAll(/^_+|_+$/gm,'').toLowerCase();
            $(this).attr('id', new_id)
        }
    });

    $("#divMainContent + div.col-md-4").css({'overflow': 'auto', 'height': '700px'}).wrapInner("<div id='tool-sidebar' class='fixed' style='height: 700px; overflow: auto;'>")

    $(window).scroll(function(){
        var headerHeight = $('#divMstrHeader').outerHeight(true);
        console.log($(window).scrollTop());
        console.log(headerHeight);
        console.log($(window).scrollTop() > headerHeight);
        if(($('footer').position()['top'] - $(window).scrollTop() - $('footer').outerHeight()) >  430) {
            $('#tool-sidebar').addClass('end');
            $('#tool-sidebar').removeClass('fixed');
        } else if ($(window).scrollTop() > headerHeight) {
            $('#tool-sidebar').addClass('fixed');
            $('#tool-sidebar').removeClass('end');
        } else {
            $('#tool-sidebar').removeClass('fixed');
            $('#tool-sidebar').removeClass('end');
        }
    });

    if($("meta[property='og:type']").attr('content') == "article") {
        $('#ctl00_ctl00_cpContent_cpContent_divTags').append(`
            <div class='temple_toc-parent pull-right' name='toc'>
                <div class="temple_toc panel panel-default">
                    <div class="panel-heading">Table of Contents</div>
                    <div class='temple_toc'></div>
                </div>
            </div>`);
        tocbot.init({
            tocSelector: "div.temple_toc",
            contentSelector: 'div#divMainContent',
            // Which headings to grab inside of the contentSelector element.
            headingSelector: 'h2, h3, h4',
            hasInnerContainers: true,
            listClass: 'list-group',
            listItemClass: 'list-group-item',
            activeListItemClass: 'list-group-item-info',
            activeLinkClass: 'list-link-active',
            linkClass: 'list-link',
            headingsOffset: 40,
            scrollSmoothOffset: -40,
        });
    }
});
