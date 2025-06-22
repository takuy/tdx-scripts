jQuery(document).ready(function() {
  jQuery('.carousel').on('slide.bs.carousel', function (event) {
      var current_slide = event.relatedTarget;
      var slide_id = jQuery(event.relatedTarget).data("slide-id");
      var parent_carousel = jQuery(event.target).attr("class").replace("carousel ", "")
      jQuery(".slide-pages .btn").removeClass("active");
      jQuery(".slide-pages .btn[data-slide-to='" + slide_id + "'][data-target='." + parent_carousel + "']").addClass("active");
      //console.log(slide_id, parent_carousel);
  });
});
