$("#nav-icon-open").on("click", () => {
    $("#nav-icon-open").css("display", "none");
    $("#nav-icon-close").css("display", "block");
    $("#navbarMob").css("display", "block");

    // Apply the transitioned styles
    setTimeout(() => {
        $("#nav-icon-close").css("opacity", "1");
        $("#navbarMob").css("opacity", "1");
        $("#navbarMob").css("transform", "translateX(0)");
    }, 200); // Add a slight delay to allow the initial styles to take effect
});

$("#nav-icon-close").on("click", () => {
    $("#nav-icon-open").css("display", "block");
    $("#nav-icon-close").css("display", "none");


    // Apply the transitioned styles
    setTimeout(() => {
        $("#nav-icon-close").css("opacity", "0");
        $("#navbarMob").css("opacity", "0");
        $("#navbarMob").css("transform", "translateX(20px)");
    }, 200);
});
