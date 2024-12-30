interface Book {
  id: number;
  title: string;
  author: string
  descriptions: string;
  price: number;
  image: string
}

interface CartItem {
  book: Book;
  quantity: number;
}

const shopping_button = document.getElementById('shoppingButton') as HTMLButtonElement;
const exit_button = document.getElementById('exitButton') as HTMLButtonElement;
const cart_sidebar = document.getElementById('cartSidebar') as HTMLDivElement;
const access_books = document.getElementById('accessBooks') as HTMLInputElement;
const search_button = document.getElementById('searchButton') as HTMLButtonElement;
const search_container = document.getElementById('searchContainer') as HTMLDivElement;
const cart_count = document.getElementById('cartCount') as HTMLSpanElement;
const cart_items = document.getElementById('cartItemsContainer') as HTMLDivElement;
const total_price = document.getElementById('totalPrice') as HTMLSpanElement;
const cart_empty = document.getElementById('cartEmpty') as HTMLParagraphElement;




shopping_button.addEventListener('click', ()=> {
                // First Way 
                cart_sidebar.style.display = "block";
                // Seond Way
                //cart_sidebar.style.display = cart_sidebar.style.display === "none" ? "block" : "none";
                // Third way
                /*
                if(cart_sidebar.style.display === "none") {
                    cart_sidebar.style.display = "block";
                } else {
                    cart_sidebar.style.display = "none";
                }
                    */
});

exit_button.addEventListener('click', ()=> {
            cart_sidebar.style.display = "none";
});

let products: Book[] = [];
let cart: CartItem[] = [];

const bookStoreFetch = async () => {
  const response = await fetch('../database/bookstores.json');
  const data = await response.json();
        products = data;
  console.log("hhhhhhhhhhhhhhhhhhh", products);
  
}


const displayProducts = (booksToDisplay: Book[]) => {
      const book_list = document.getElementById('bookList') as HTMLDivElement;
        book_list.innerHTML = '';
        booksToDisplay.forEach((product) => {
      const bookDiv = document.createElement('div');
         bookDiv.className = 'w-[200px] min-h-[300px] h-max border border-slate-50 rounded bg-transparent text-center mt-[5px]';
         bookDiv.innerHTML = `
         <img src=${product.image} alt=${product.title} class="w-[200px] h-[150px] rounded"/>
         <h1 class="text-emerald-400 text-medium">${product.title}</h1>
         <h3 class="text-amber-400">${product.author}</h3>
         <p class="text-slate-50">${product.descriptions}<p>
         <p class="text-rose-400 pt-1">$${product.price}</p>
         <button onclick="addToCart(${product.id})" class="w-[150px] h-[30px] bg-emerald-400 rounded font-medium text-[14px] mb-[10px] pb-1 hover:bg-white hover:text-emerald-400"> add basket</button>
        `
       book_list.appendChild(bookDiv);
       console.log("bookDiv", bookDiv);
  });
  
}

const addToCart = (bookId: number) => {
      const bookToAdd = products.find(book => book.id === bookId);
      if(bookToAdd){
           const existingItem = cart.find(item => item.book.id === bookId);
           if(existingItem){
                existingItem.quantity++;
           }else{
             cart.push({book: bookToAdd, quantity: 1 })
           }
      }
      
      updateCartCount();
      displayItemCart()
} 


const updateCartCount = () => {
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  if(cart_count){
        cart_count.textContent = totalItems.toString()
  }
}


const displayItemCart = () => {
      if(cart_items){
        cart_items.innerHTML = '';
        if(cart.length === 0){
        cart_items.innerHTML = `<p class="text-semibold text-slate-500 text-center text-lg" id="cartEmpty"> You cart items is empty ....! </p>`
        }
        let total = 0
           cart.forEach(item => {
            const itemDiv = document.createElement('div');
                  itemDiv.className = 'flex justify-between items-center mb-4 mt-[50px]';
                  itemDiv.innerHTML = `
                             <img src="${item.book.image}" alt="${item.book.title}" class="w-[50px] h-[75px] rounded border border-slate-400 mt-2"/>
                             <div class="flex-1 ml-4">
                               <h4>${item.book.title}</h4>
                               <p>$${item.book.price}</p>
                               <div class="flex items-center mt-2 gap-2">
                                  <button onclick="removeItemCart(${item.book.id})" class="bg-rose-400 w-[25px] h-[25px] pb-4 rounded">-</button>
                                  <span class="mx-2 inline-block text-lg">${item.quantity}</span>
                                  <button onclick="addToCart(${item.book.id})" class="bg-emerald-400 w-[25px] h-[25px] pb-4 rounded">+</button>
                               </div>
                             </div>
                                <button onclick="clearCart()" class="bg-rose-400 text-white mt-4 rounded absolute bottom-[20px] right-0 w-full h-[40px] text-sm"> Delete All Cart </button>
                                   `;
                              cart_items.appendChild(itemDiv);
                              total += item.book.price * item.quantity;
           });
           if(total_price){
            total_price.textContent = total.toFixed(2)
           }
      }
         
}
const removeItemCart = (bookId: number) => {
      const itemIndex = cart.findIndex(item => item.book.id === bookId);
      if(itemIndex > -1){
          if(cart[itemIndex].quantity > 1){
             cart[itemIndex].quantity--;
          }else{
            cart.splice(itemIndex, 1)
          }
      }
  updateCartCount();
  displayItemCart();
}
  const clearCart = () => {
     cart = [];
    updateCartCount();
   displayItemCart();
  }



const searchBooks = () => {
  /*
  search_button.addEventListener('input', () => {
    const searchValue = access_books.value;
    const filteredBooks = products.filter((book) => {
      return book.title.toLowerCase().includes(searchValue.toLowerCase());
    });
    displayProducts(filteredBooks);
  });
*/
  search_button.addEventListener('click', () => {
    const searchValue = access_books.value;
    const filteredBooks = products.filter((book) => {
      console.log("book", book);
      return book.title.toLowerCase().includes(searchValue.toLowerCase());
      
    })
    displayProducts(filteredBooks);
    
  })

}
searchBooks();
const suggestionDiv = document.createElement("div") as HTMLDivElement;
      suggestionDiv.textContent = "All Booooooks Lists";
      suggestionDiv.className ="absolute top-0  left-[200px] mt-5 text-white text-lg font-bold w-[250px] pl-[35px] pt-[7px] p-4 min-h-[30px] h-max shadow-md z-[99]"
      search_container.appendChild(suggestionDiv);

const suggestionList = document.createElement("ul");
suggestionList.className = "absolute top-[70px] left-[200px] bg-white rounded w-[250px] pl-[35px] pt-[7px] p-4 min-h-[50px] h-max shadow-md text-zinc-900 z-[99]";
     
      search_container.appendChild(suggestionList)


const updateSuggestions = (filteredBooks: Book[]) => {
     suggestionList.innerHTML = '';
     

     filteredBooks.forEach((book) => {
      const suggestionItem = document.createElement("li");
            suggestionItem.textContent = book.title;
            suggestionItem.className = "p-2 hover:bg-emerald-400 text-zinc-700 cursor-pointer rounded";
    
            suggestionItem.addEventListener("click", ()=> {
              access_books.value = book.title;
              suggestionList.innerHTML = '';
             
              displayProducts([book]);
            });
            suggestionList.appendChild(suggestionItem);
            
     });
     
 
};

const liveSearch = () => {
  access_books.addEventListener("input", ()=> {

    const searchValue = access_books.value.toLowerCase();
   
    const filteredBooks = products.filter((book) => {
      return book.title.toLowerCase().includes(searchValue);
    });
    updateSuggestions(filteredBooks);
  })
}

liveSearch();



bookStoreFetch();
