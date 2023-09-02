let sortedItems = [];

// Function to fetch category menu
const loadCategoryMenu = async () => {
    const URL = 'https://openapi.programming-hero.com/api/videos/categories';
    const res = await fetch(URL);
    const data = await res.json();
    displayCategoryMenu(data.data);
}

// Function to display the category menu
const displayCategoryMenu = (categoryData) => {
    const categoryMenuContainer = document.getElementById('category-menu');
    categoryData.forEach(category => {
        const categoryMenu = document.createElement('div');
        categoryMenu.innerHTML = `
            <button onClick="loadCategoryWiseItems(${category.category_id})" class="bg-gray-200 rounded-md px-4 py-1 hover:bg-red-600 hover:text-white">${category.category}</button>
        `
        categoryMenuContainer.appendChild(categoryMenu);
    })
}

// Function to load category-wise items
const loadCategoryWiseItems = async (categoryId) => {
    const URL = `https://openapi.programming-hero.com/api/videos/category/${categoryId}`;
    const res = await fetch(URL);
    const data = await res.json();
    // console.log(data.data);
    displayCategoryWiseItems(data.data);
    sortedItems = [];
    sortedItems.push(data.data);
}


// Sort by view
const sortByViews = () => {
    sortedData = sortedItems[0].sort((a, b) => parseFloat(b.others.views) - parseFloat(a.others.views));
    displayCategoryWiseItems(sortedData);
};

const sortButton = document.getElementById('sort-by-view');
sortButton.addEventListener('click', sortByViews);


// Function to display category-wise items
const displayCategoryWiseItems = (categoryItems) => {

    const categoryItemsDisplayContainer = document.getElementById('category-items');
    categoryItemsDisplayContainer.innerHTML = '';

    const displayGridDiv = document.createElement('div');
    displayGridDiv.classList.add('grid', 'sm:grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-4', 'gap-5');
    categoryItemsDisplayContainer.appendChild(displayGridDiv);


    if (categoryItems.length === 0) {
        const notFoundMessageDiv = document.createElement('div');
        notFoundMessageDiv.classList.add('flex', 'flex-row', 'items-center', 'justify-center');
        notFoundMessageDiv.innerHTML = `
            <div class="flex flex-col items-center mt-24">
                <img class="w-32" src="./assets/img/no-video.png" />
                <h2 class="text-center text-xl font-bold mt-4">
                    Oops!! Sorry, There is no<br> content here
                </h2>
            </div>

        `;
        categoryItemsDisplayContainer.appendChild(notFoundMessageDiv);
    }

    categoryItems.map(categoryItem => {
        const categoryItemDisplayDiv = document.createElement('div');
        categoryItemDisplayDiv.classList.add('card', 'bg-base-100', 'hover:shadow-xl');

        const time = categoryItem.others?.posted_date
        const hour = Math.floor(time / 3600);
        const minute = Math.floor((time % 3600) / 60);

        let formattedTime = '';

        if (hour === 0 && minute > 0) {
            formattedTime = `${minute} min`;
        } else if (hour > 0 && minute === 0) {
            formattedTime = `${hour} hrs`;
        } else {
            formattedTime = `${hour} hrs ${minute} min`;
        }

        categoryItemDisplayDiv.innerHTML += `
            <div>
                <figure class="px-2 pt-5">
                    <img class="w-full h-[180px] object-cover rounded-md" src="${categoryItem.thumbnail}" alt="" />
                </figure>

                ${categoryItem.others?.posted_date && `
                    <p class="absolute p-2 right-4 bottom-32 mb-2 bg-slate-900 rounded-md text-white font-normal text-xs">
                        ${formattedTime + ' ago'}
                    </p>
                `}
            </div>
            <div class="mt-6 pl-2 flex flex-row gap-4">
                <img class="rounded-full w-[50px] h-[50px]"
                     src="${categoryItem.authors[0].profile_picture}" />
                <div class="mb-4">
                    <h2 class="font-bold ">${categoryItem.title}</h2>
                    <div class="text-slate-400 mt-2 flex gap-1 items-center">
                        <span>
                            ${categoryItem.authors[0]?.profile_name}
                        </span>
                        <span>
                            ${categoryItem.authors[0]?.verified ? '<i class="fa-solid fa-circle-check text-blue-500 text-xl"></i>' : ''}
                        </span>
                    </div>
                    <p class="text-slate-400 mt-1">${categoryItem.others.views} views</p>
                </div>
            </div>`
        displayGridDiv.appendChild(categoryItemDisplayDiv);
    })
}



loadCategoryMenu();
loadCategoryWiseItems('1000');

