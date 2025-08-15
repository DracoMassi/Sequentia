const input = document.getElementById("searchInput");
const listItems = document.querySelectorAll("#itemList .item");

input.addEventListener("input", function () {
    const filter = input.value.toLowerCase();
    listItems.forEach(item => {
        const img = item.querySelector("img");
        const altText = img ? img.alt.toLowerCase() : "";
        if (altText.includes(filter)) {
            item.style.display = "";
        } else {
            item.style.display = "none";
        }
    });
});

