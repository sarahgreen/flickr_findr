Sarah Green 
stg2117 
User Interface Design 
10/3/14 

Assignment 1: Part 3 

Instructions to use my Flickr image search application: 
	1. Ensure that all files listed below are in the root directory 
	2. Open index.html 
	3. Try out the application! 

Guide to this directory: 
* index.html: open this file to interact with the application 
* styles.css: style sheet for the application 
* script.js: JavaScript/jQuery script for make my application 
* node_modules: directory containing flickrapi, which I installed using npm 
* images: directory containing image files used in my interface 

Design decisions: I designed this single page application to be as simple and 
straightforward as possible. I modeled the search page off of Google, a tool that 
most web users are familiar with. I used the CSS property display:none to only show  
the search page or the gallery page at any given time. I chose to use a dark gray 
background with white text to keep the focus on the Flickr images, but I included 
some bright pops of orange and teal because these bright, complementary colors 
help create a happy, energetic, and modern feel. I chose a simple sans-serif 
font to make the text easy to read. The language I used for buttons/input fields/
labels/headers is intended to be intelligible to tech-illiterate users, without being 
overly verbose. I hid the full URLs to the original photo and the user's profile 
in each photo caption, to make these links more readable. I tried to achieve a 
balanced overall design by aligning elements symmetrically and centrally. I 
wanted to keep the functionality very clear. Buttons/links change color on hover, to 
indicate they can be clicked. The magnifying glass is a generally accepted icon 
to represent "search," but the user can also just hit the "Enter" key from any input 
box to trigger a search. I used placeholder text in the input fields to explain 
in simple English which search parameters each box corresponds to (and this 
placeholder text disappears on focus to make room for the user's input). My 
application overall aspires to simplicity, but to keep things interesting I used 
jQuery transitions between the search and gallery pages. For the same reasons, 
I also added a light overlay for photos currently being hovered upon, and I  
used a grid icon to be the application logo/favicon. I hope these features 
help rouse the user’s excitement. 

To maximize the application's flexibility, I made it responsive to changes in 
browser window size. The font, font size, complementary color scheme were chosen 
to make the application accessibile to users with visual disabilities. I also 
included alerts for invalid searches, such as a missing search string or invalid 
date range. These help the user understand how to form a valid search query, and 
block bad requests to the Flickr API. If no photos are found for a valid search, 
then an error message is displayed and the “show more” button is hidden, so the 
user's only option is to go back and try another search. For the Flickr API 
requests, a maximum of 250 photos are fetched per call to the API. I chose this 
number (after a lot of testing) as a compromise between (a) maximizing the number of 
photos fetched at a time so as to not run out of hourly allowed queries, and 
(b) minimizing the amount of time the user must wait for images to be displayed 
(thus accomodating for a variety of Internet speeds). Lastly, I included a footer 
with the words "Need Help?" that on click trigger a modal dialog box to open. 
This box contains relevant information for using my application. To close the modal, 
the user can click the X in the top-right corner.
