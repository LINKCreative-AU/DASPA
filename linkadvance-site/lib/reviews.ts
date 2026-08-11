// Every Google review LINK Advance publishes, verbatim. Names and text are
// untouched: reviews are only ever labelled here, never edited or paraphrased,
// so every count on /reviews can be checked against the words above it.
//
// Two tag families, both read from what the review itself says:
//   service - what the client came in for
//   praise  - what they singled out about the work
// A review can carry several of each, and a few name no transaction at all,
// which is why the praise family exists: without it those reviews would sit on
// the page unreachable by any filter.
//
// NOTE on schema: these are not marked up with Review/AggregateRating. Google's
// review snippet policy makes a page ineligible for review rich results when
// "the entity that's being reviewed controls the reviews about itself", which
// covers a business publishing its own Google reviews on its own site. The
// reviews earn their keep here as crawlable text and as the answer to
// "is LINK Advance any good", not as stars we are not entitled to.

export type Service =
  | "First home"
  | "Refinance"
  | "Investing"
  | "Bought & sold"
  | "Home purchase";

export type Praise = "Communication" | "Made it simple" | "Better rate" | "Knew their stuff";

export type Review = {
  name: string;
  text: string;
  service?: Service;
  praise: Praise[];
};

export const REVIEWS: { name: string; text: string }[] = [
  { name: "Alys Taylor", text: "Hugh and the team have been great, guiding us through the daunting process of buying a home as first home buyers. We’ve really appreciated how communicative and responsive they have been." },
  { name: "Micky Parker", text: "The BEST experience with LINK Advance! I came to Jacob at LINK with a fairly stressful property purchase, and from the very beginning his prompt, professional approach put me completely at ease. He was able to secure me a great loan outcome, and his communication throughout the entire process was clear, proactive, and exceptional. Thank you, thank you! I've bought and sold three properties and worked with multiple brokers over the years, and LINK Advance is easily the best. I highly recommend Jacob and the entire team!" },
  { name: "James Roberts", text: "We had a lovely experience with Jacob, well mannered young man. Very professional and knew what he was doing." },
  { name: "Janae Paton", text: "We recently refinanced our home loan and couldn't be happier with the service from Jacob. Communication was outstanding from start to finish. We were kept informed every step of the way and nothing was ever too much trouble. He made the whole process easy, stress-free, and helped us get a great outcome. An absolute legend to deal with, incredibly knowledgeable, professional, and genuinely the coolest guy ever. If you're looking for a mortgage broker who goes above and beyond, we couldn't recommend him highly enough!" },
  { name: "Brooke McHattie", text: "Thank you Jacob and the LINK Advance team for all your help purchasing our first home. Greatly appreciate your timely responses and wealth of knowledge that made this an easy process." },
  { name: "Sarah Wilson", text: "Callum and Richard take the time to explain what can be a very challenging and complex market - talking you through different options and scenarios to help you make informed decisions. I have appreciated the level of communication and service from the team - thank you!" },
  { name: "Kate Tinta", text: "Seamless experience dealing with Hugh and the Link Advance team to refinance our home. Thank you!" },
  { name: "Michelle Dehlen", text: "The Team at Link Advance at fantastic!!! Just renegotiated my home loan and extremely happy with the result!!! Thank you!" },
  { name: "Ye Lin", text: "Callum was fantastic to work with throughout our home purchase journey. Very responsive, passionate about what he does, and constantly following up with updates so we always knew where things were at. Definitely recommend Callum and the team to anyone looking for a reliable mortgage broker." },
  { name: "Nicola Todhunter", text: "Hugh and the team have been fantastic to deal with! Open and consistent communication, and helped answer the many questions we had! The process from start to finish was easy, and the team made it smooth and as stress free as home loans can possibly be. Would absolutely recommend!" },
  { name: "Zane Ratcliff", text: "Jacob was an efficient mortgage broker. The process was made simple and constant updates were communicated. Any questions asked were responded to timely. Highly recommend Jacob." },
  { name: "Tom Howden", text: "My partner and I bought our first home with the help of Callum at LINK. He helped us from the start of the process right up until settlement. Callum was extremely insightful and spent a lot of time aiding us in facilitating the process and being a great source of information. We would highly recommend LINK and Callum for anyone purchasing a home - especially first home buyers; as we were." },
  { name: "Genevieve Scanlan", text: "Jacob provided informative and friendly service every step of the way. He was a great comfort to us as first home buyers as we knew we were in good hands. Thanks for all of your help Jacob!" },
  { name: "Jack Purtill", text: "Callum and the team were fantastic to deal with every step of the way. As first home buyers we really appreciated Callum's simple explanations of each part of the process and we couldn't be happier with the result." },
  { name: "Madison Else", text: "Thank you to Jacob for his exceptional service in helping us secure our first investment property. He was fast and efficient and made sure we understood everything along the way. 10/10 would recommend Jacob and the Link Advance team. Awesome work guys!!" },
  { name: "Connor Mahoney", text: "Jacob and the team at LINK Advance made buying our investment property quick and painless. Would recommend" },
  { name: "Timothy Warren", text: "We had a great experience working with our mortgage brokers, Hugh, Callum and Jacob. They were easy to communicate with, super proactive and made the financing side of buying and selling our home feel straightforward and manageable. Their guidance gave us real peace of mind and we are so thankful for their support." },
  { name: "Jodie Warren", text: "We had a fantastic experience with LINK Advance from start to finish! Hugh, Jacob & Callum helped me sell my home and purchase a new one. They were knowledgeable, responsive, and had our back the entire process. We always felt informed and supported. Highly recommend to anyone needing an amazing mortgage broking team." },
  { name: "Britta Webb", text: "I just wanted to say a huge thank you to the team at LINK for all your help with our investment property. We honestly could not have done it without you. Your communication, support and knowledge throughout the entire process were outstanding and you made what could have been a very stressful experience feel smooth and manageable. We are so grateful for all of your hard work and would highly recommend LINK to anyone looking for guidance and support." },
  { name: "Vicki Burton", text: "As first home buyers with lots of questions and uncertainty, we couldn't have asked for a better experience with Hugh and the team. They were consistently patient and supportive throughout the entire process, making what could have been a stressful time feel smooth and easy to navigate. Hugh took the time to explain everything in detail, always made us feel as ease, and genuinely cared about helping us achieve our goal. We felt supported from start to finish, and were so grateful for the team's guidance and professionalism. Highly recommend to anyone looking for a trustworthy and dedicated mortgage broker!" },
  { name: "Naguib Hardie", text: "Jacob has been instrumental from search to settlement for my first home purchase. I would recommend him to anyone who needs a mortgage broker that is efficient, professional, and easy to work with, while also looking out for your best interests." },
  { name: "Anthony Arthur", text: "We just used Link Advance do the second time to refinance our home. It was as quick, easy and painless as the first time we used them. Hugh and Jacob made sure we knew everything and answered all our questions promptly. We will be using them next time we refinance the home I would recommend everyone I know to use Hugh an his amazing team of people to help them achieve their goals owning a home or getting a better rate." },
  { name: "Philip Kelly", text: "I can't thank Callum, Hugh and Jacob enough for their help and guidance on the sale of our existing home and the purchase of our new home. Nothing was to much trouble, you were all efficient, reliable and a pleasure to deal with. I have no hesitation in recommending your company to my friends, family and business associates. Kind Regards Phil Kelly" },
  { name: "Jessica Dale", text: "Caring, kind and very clever ! We have felt supported throughout this whole experience of getting our first home loan. Hugh and the team even renegotiated our interest rate proactively which has brought welcome savings for our family. Without hesitation I recommend Hugh and his team!!" },
  { name: "kara dunnage", text: "Callum communicated with me throughout the process and made the stressful experience of selling and purchasing a new home a reassuring and easier one. I would highly recommend him and had the helpful hand of Hugh too. I’m relieved and grateful my neighbor gave me the contact for Link. Know that you’re in good hands." },
  { name: "Michael O Sullivan", text: "We had a fantastic experience working with Callum and the team at LINK Advance. They were highly responsive and provided excellent guidance throughout both the sale of our home and the purchase of our new one. I would happily recommend LINK to friends and family." },
  { name: "hannah medley", text: "We’ve just bought our first home with the help of Callum and the team at LINK, and we couldn’t be more grateful. Callum went above and beyond, kept us informed every step of the way, and made the whole process feel easy and stress-free. Highly recommend!" },
  { name: "Tom Wolff", text: "Hugh was great to deal with. Super efficient and great at communicating the complicated side of getting a mortgage. He was always cool & level headed which helps during the stressful period of finding finance and sorting everything financial that's related to buying and selling. Would recommend him and his team to anyone." },
  { name: "Tyler Horton", text: "I highly recommend Hugh and the team at Link Advance! My partner and I were so glad to have their help as we purchased our first home this year. Hugh made everything so easy for us and was very patient with all of our questions! He was always very helpful and quick to respond to our emails too. Thanks for everything!!" },
  { name: "Ellen Crump", text: "Hugh and his team have been fantastic to work with. The whole process has been seamless and has gone through very quickly. Excellent communication, organisation and they’ve made the whole thing stress free. Have already recommended to friends and family. Thanks!" },
  { name: "Lindie Verster", text: "Hugh and his team were absolutely amazing. They are excellent at guiding you through the whole process, they work fast and get the job done. Communication was prompt and clear, with friendly knowledgable answers to any questions you may have. A pleasure to do business with them - we would highly recommending using this company!" },
  { name: "Rachel Kendrick", text: "It has been such a pleasure to do business with Hugh and his team. Their communication is excellent and they made the whole process so smooth for us. We couldn’t recommend them highly enough" },
  { name: "Rafael Castro", text: "We have been utterly impressed with the service and experience from Hugh and his team at LINK Advance. In what can be a daunting and stressful process, they have provided support, professionalism, knowledge and guidance to aid in purchasing our first property. We would not hesitate to recommend LINK Advance to our friends and family." },
  { name: "Danika Sayce", text: "Very highly recommend! Hugh was fantastic to deal with. We cannot thank him enough for getting us settlement ready so quickly. Hugh made the process much less daunting, so smooth and easy to understand, and always answering any queries we had. Thank you Hugh!!" },
  { name: "Michael White", text: "Hugh and the rest of the team were excellent at securing us a home loan. Knowledgeable, friendly, very communicative and made the entire process stress free and easy. We can’t recommend Hugh and the rest of the team at Link Advance enough." },
  { name: "Alison Brand", text: "Hugh and Callum at LINK Advance - well, what can I say - you were both fabulous of course! You got us over the line AGAIN, so our investment dreams could come to life. Efficient, candid, effective, knowledgeable and supportive. Your services have made the process smooth sailing from contract to settlement. A thousand thank yous!" },
  { name: "Hannah Erlandsson", text: "Hugh and the team have been amazing and helpful. As First home buyers we had a lot of questions and they navigated us through the process. They have a lot of knowledge and experience. We recommend Hugh and the team to anyone looking to purchase a home!" },
  { name: "Rachel Cullen", text: "We worked with Hugh to refinance our Home Loan. He was great to work with and we would absolutely recommend him to others. We never felt we had to chase him up, he was always providing us with constant updates as we went through the process. Thanks Hugh!" },
  { name: "Nicholas Bryant", text: "Jacob and Hugh were both incredibly helpful in securing me a complicated loan for my new property. I am very grateful for their professionalism and service. Their communication was excellent throughout the entire process." },
  { name: "Thomas Bidstrup", text: "Hugh and the team have been excellent to deal with. Great people, excellent communication and always happy to answer questions throughout the process. No hesitation in recommending their services." },
  { name: "Tameeka Taylor", text: "My partner and I are buying our first home and have had nothing but an amazing experience with LINK. Hugh and Callum have been there to help us throughout the whole process and have made everything very simple and easy to understand. They have made a very stressful process feel like a walk in the park. I recommend them highly." },
  { name: "Hayley", text: "Hugh and his team are a pleasure to work with. They are prompt, easy to communicate with, knowledgeable, professional and bring lots of enthusiasm. We will definitely use them again in future and are grateful for their help in securing our home loan." },
  { name: "Madeline Duck", text: "Hugh made our buying experience so much easier than we had expected. He was always willing to answer every question we had (and there were a lot!) and helped us to understand the ins and outs of our loan and all the documents. Also just friendly and happy to chat. Thank you so much Hugh, I would highly recommend you to anyone!" },
  { name: "Emily Luck", text: "Hugh recently helped us with the mortgage for our first home and we honestly couldn't have done it without him. He made the process so easy for us and answered my million and one questions. He is professional, easy to deal with and gets the job done!" },
  { name: "Hamish MacDonald", text: "Hugh and Callum were a pleasure to work with, and they made the mortgage process as straightforward as possible. We particularly appreciated the time they took to explain each part of the process, and their fast and detailed responses to our (many) questions. Highly recommended!" },
  { name: "Sarah Sheppard", text: "Hugh and Callum have been so friendly, efficient and thorough during our time using them as our mortgage broker. They made the whole process so easy and always made time to explain things thoroughly to us in a way we could understand. We'd highly recommend them and will be using them for years and years to come" },
  { name: "Greta Nelles", text: "Couldn't be happier with all of the help and support I received from Callum in buying my first home. He was extremely communicative, proactive and able to explain things in terms understandable for a novice like myself. Very grateful for all of his hard work." },
  { name: "Sydney Fleming", text: "Hugh & Callum were great to deal with - both friendly and professional. I would recommend them to anyone as they were thorough, took the time to explain how everything worked & what to expect and quick to respond." },
  { name: "Dana Qureshi", text: "Building a house can be so stressful and overwhelming let alone dealing with the finance aspect of it, however with Callum it has been the exact opposite. He has been so patient and extremely helpful throughout the whole process. Highly recommend!" },
  { name: "Ilse Surridge", text: "Hugh and Callum took the time to steer us expertly through the loan application process, answering our many questions along the way. Thanks a million guys, your help through an extremely stressful time was invaluable. Highly recommended." },
  { name: "Megan Wilson", text: "Buying our first home was super daunting and took a very long time. Callum and Hugh were with us the whole time (15 months of searching!) and gave us great advice that took a lot of the stress away. Thanks guys :)" },
  { name: "Simon Chamberlain", text: "Hugh and Callum have been fantastic through the experience of buying our first property! Always there to answer our silly questions and working hard to get us the best outcome! Would highly recommend!" },
  { name: "Van Trinh", text: "Buying a house is hard especially in this market. Thank you to both Hugh and Callum. Couldn’t ask for better brokers to help with the process. Both explained everything to us in depth and gave us valuable advices." },
  { name: "Lizalet Oosthuizen", text: "Hugh made the process seamless and stress free. He kept us informed all the way through - we would highly recommend Hugh." },
  { name: "Lily May Johnston", text: "I highly recommend Hugh and Callum! They assisted us to purchase our first home and are always willing to work outside of the box to make things happen. Thank you so much team!" },
  { name: "Jacob Bradford", text: "Callum, Hugh, Brad and the team at Link offer a consistently knowledgeable and professional service, allowing their customers to feel supported every step of the way!" },
  { name: "Heidi Zandazad", text: "Did a great job securing our first property. Highly recommend, easy to deal with and made the process so simple for us" },
  { name: "David Laurie", text: "Hugh and team were so fantastic last time we went through the process that we absolutely had to go with them again!" },
  { name: "Kaija Salier", text: "Fantastic communicators and very knowledgeable. Really took time to understand our unique situation and how to get the best outcome for our loan." },
  { name: "Andrew Waddell", text: "The team at LINK advance were brilliant! They helped us through the entire process and made it really easy to understand!" },
  { name: "Luke Chaplain", text: "Hugh and the team were great. Genuinely recommend using LINK Advance." },
  { name: "C B", text: "First broker I didn't have to spend 3 hours filling forms and collecting documents for. Happy with the advice Callum provided" },
  { name: "Peter Ogden", text: "Very helpful and incredible to deal without throughout the entire process. I have already recommended them to most of my friends!" },
  { name: "Fiona Doherty", text: "Hugh was fantastic to deal with - extremely helpful and knowledgeable." },
  { name: "Stuart Brown", text: "Very professional and helpful made the process of buying my first home very easy." },
  { name: "mark allen", text: "We got a great result from Hugh!" },
  { name: "Robyn", text: "Huge Thank you to the amazing LINK Advanced team, particularly Callum, who assisted us every step of the way with his amazing knowledge!" },
  { name: "Luke Gilly", text: "Hugh, Callum and the team were unreal! They went above and beyond to get us the best loan possible and explain every step along the way. Can not recommend these legends enough." },
  { name: "Nat Green", text: "Lovely experience. Nice and easy to deal with. Great advice." },
  { name: "Adriana Alvavarenga", text: "The service is outstanding and Hugh is great to work with!" },
  { name: "Rhonda Burton", text: "Such an easy process. Thank you for your expert assistance" },
  { name: "Andrew Judd", text: "Professional and friendly service, valuable advice and even better result!" },
  { name: "Chris Denhez", text: "Professional, responsive, and friendly service" },
  { name: "Jye", text: "Hugh made the process of buying a house stress free. Always quick to respond, and got things done quickly. Highly recommended." },
  { name: "Catherine Curran", text: "Hugh was informative and professional. A pleasure to work with. Highly recommend." },
  { name: "Sinead Curran", text: "Hugh was quick and responsive. Great customer service with effect results. Thanks again for your help." },
  { name: "Amanda Fowler", text: "It is so refreshing to have great communication and to be recognised as an individual customer. The speed and commitment to achieving client outcomes is amazing." },
  { name: "Wendy Clark", text: "Hugh the ever professional takes the frustrations away of dealing with financial institutions and their need of forms. Would highly recommend Hugh" },
  { name: "Lawrence O’Neill", text: "Thank you Hugh. Did more then I needed and very quickly! Will continue to use you for anything I need and will definitely recommend to clients and friends!" },
  { name: "Deirdre Cosgrave", text: "Excellent service. Hugh went above and beyond to get us the best deal possible. We will definitely be recommending him to friends and family." },
  { name: "Harriett Guy", text: "Hugh was great with his communication and was able to walk me through my different options. I’d have no hesitation in recommending him to anyone." },
  { name: "LOUISE MCQUILLAN", text: "Hugh's professionalism, advice and care are second to none. I highly recommend his services to anyone looking for an experienced mortgage broker." },
  { name: "Mish Hinde", text: "Hugh was a great help throughout the whole process. Made a confusing process very easy! He was a dream to work with!" },
  { name: "Daniel Allen", text: "The team at Link are beyond professional. Their approach to focusing on the customer experience and being sensitive to my personal circumstances is what really set them apart from the rest. I would recommend Link to anyone and everyone without hesitation." },
  { name: "Jules", text: "Hugh was great getting us organised and ready to buy! Great result and would happily use Hugh again. Thank you!!" },
  { name: "Prudence Krook", text: "Hugh Dellit was fantastic to work with and truly understood our needs when it came to applying for our first home loan. I would highly recommend him for his professional, kind and friendly service." },
  { name: "Campbell Banks", text: "When I was looking for finance for my first home, I spoke with a few brokers but eventually settled on Link Advance and dealt with Hugh. I got some invaluable advice and had a strategy put in place which was wholly customised to me. I’m now well on my way to buying my first of hopefully many properties!" },
  { name: "Chloe Mander", text: "Hugh is my go to for advice on getting a loan, consolidating finances and minimising interest! He is a massive wealth of knowledge and such a lovely guy to deal with. Highly recommend!" },
  { name: "John Forwood", text: "Hugh has looked after a number of my clients. Without fail each and everyone of them has had great things to say and love the service that Hugh and the Link team offer." },
  { name: "Jarvis Archer", text: "Hugh was amazing. Achieved a great result, was proactive in foreseeing and resolving any obstacles so things went smoothly for us. 10/10 would use Hugh again." },
  { name: "Christopher Tague", text: "I bought my first property earlier this year and can’t thank the team at Link enough. Going through the experience of purchasing a home for the first time can be extremely daunting but Hugh and co. managed to break it down and took the time to guide me through it, step by step. They scored me a great interest rate too! 5/5" },
  { name: "Richard Johnson", text: "I would highly recommend Hugh. The Home Loan application and refinance went through quickly and seamlessly. Hugh was very responsive to our queries and never made us feel our questions were unnecessary or annoying! Thanks Hugh :)" },
  { name: "Clodagh Creighton", text: "Hugh was very informative and listened to our needs. He worked out the most suitable options and talked us through it all. Would highly recommend him to anyone." },
  { name: "Chloe Nelson", text: "Hugh was extremely helpful in helping me get finance for my first home. I’d spoken to a few mortgage brokers previously and he was easily the best!" },
  { name: "Lucas", text: "Hugh handled our refinance from start to finish and kept in touch the entire time. I’d highly recommend Hugh from Link Advance to anyone looking for a great mortgage broker." },
  { name: "Colin Farrelly", text: "I can HIGHLY recommend Hugh, he went above and beyond for us (who were clueless!) and helped us along every step of the way. Very understanding and professional and makes the whole process a breeze. 10/10" },
  { name: "Ashlee Percival", text: "Hugh has been amazing throughout the process of buying our new house. He is very approachable and knowledgable and went above and beyond what we expected to help us out. Thanks so much Hugh!" },
  { name: "Stephanie Albert", text: "Hugh was excellent to work with. He is extremely professional and made the whole process so easy and stress-free. I would highly recommend Hugh and his team to family and friends." },
  { name: "adrian heighway", text: "Hugh is absolutely great, and has put a lot of peace to my mind with the advice he gives. Very pleased with his service and am very glad to have found such a great a person like himself. Will most definitely be recommending him to other people." },
  { name: "Isobel Brigden", text: "Hugh was fabulous during the whole home loan process. Got me more than I wanted and kept me in the loop the whole time! Also was happy to answer any and all questions. More than happy with his work!" },
  { name: "Michael Stower", text: "Hugh from Link Advance - Mortgage Broker assited me in securing a home loan with Hugh and the company being extremely helpful and making the whole process flow with minimal complications. I would recommend Hugh if you are looking for assistance with a mortgage." },
  { name: "Pat Marc", text: "Hugh helped immensely with our loan needs, the process was simple and easy to understand thanks to Hugh. Absolute expert when it comes to loans, his knowledge is remarkable and I felt like I could ask him anything." },
  { name: "Arieta Park", text: "Hugh is an absolutely fantastic broker! He provides a very reliable, professional service and is great at keeping you updated on the progress of an application / steps next! I would recommend him if you are looking for a broker!!!" },
  { name: "Alejandra Hurtado", text: "Very impressed on how easy and stress-less Hugh and Callum made the refinance process for us. If you are looking for the BEST and EASIEST home loan experts, get in touch with Link Advance. 10 out of 10." },
  { name: "Kevin Mayorga", text: "Huge thanks to Hugh, Callum, Ale and the whole Link team. Their support during the whole process was amazing. They really went above and beyond. Even I have a hard case to begin with, they manage to get it through. I would recommend them 100%" },
  { name: "Neil Loo", text: "It was a pleasure working with Hugh and the team. They were always very quick to respond and were helpful in answering any questions I had. The whole process from start to finish was very smooth. Highly recommended!" },
  { name: "Julian BSR", text: "Hugh did a great job chasing the CBA for us to acquire a loan - A grade communication throughout the whole thing, which was great for a guy like me who has no idea how any of this stuff worked. Thanks mate." },
  { name: "Jo-Anne Boulton", text: "I met with the guys at Link Advance a while ago. I knew I wanted to own my own place but I didn’t really know where to start or how much I’d need to save. Thanks to these guys, I’m on track to buy something early next year!" },
  { name: "Jacob Krusche", text: "Hugh has been responsive, transparent and supportive throughout the whole process. Highly recommend." },
  { name: "Michael Mal", text: "The link Advance team were fantastic. They were professional, practical and efficient. They made the entire loan process easy. Would recommend." },
  { name: "Roberto Alvarenga", text: "What an outstanding service! Thanks very much Hugh for guiding us thru a complex process. Super friendly and professional with attention to detail. Anyone who needs a broker, this is your guy." },
  { name: "Serene Duff", text: "Amazing service, the first person I've seen where I truly felt like I could really trust and rely on for my home loan application. Thanks Hugh!!" },
  { name: "Naes", text: "Hugh is always super helpful and always looking out for our business interests. I would recommend them to any business for anything." },
  { name: "Josh", text: "Thanks for the great help with a refinance! Great communication and quick/prompt getting the process sorted." },
  { name: "Kayla Jackson", text: "Hugh really went above and beyond on the finance for our new home. He was always available for our questions, and kept us informed throughout the whole process." },
  { name: "Amy Johnston", text: "I cannot recommend Hugh from Yellow Brick Road Morningside highly enough, he has been extremely helpful from the beginning, Hugh made the process extremely easy and we recevied the outcome we hoped for with a fast turn around. We will be recommending your company to anyone and everyone looking for these services. Thanks again Hugh." },
  { name: "Josh McKinnon", text: "I dealt with Hugh late last year when I started looking at getting my first home loan. He was able to walk me through the process of getting my loan, as well as explain to me all my options with the advantages and disadvantages of each. I’d highly recommend him to anyone who needed finance to buy their first property." },
  { name: "John Macmahon", text: "I'm in the early to mid stages of my journey to buying my first home, found Link Advance and have been really impressed with the service so far. So appreciative of Hugh's advice, guidance and simplified way of explaining the steps in the process." },
  { name: "Olivia Reynoldson", text: "Hugh made purchasing our first home a stress free event! He was prompt in response to communication, transparent regarding the whole process and was a pleasure to deal with! Will be recommending him to friends" },
];

// Assigned by reading each review. Where a review names no transaction, the
// service tag is deliberately absent rather than guessed.
const SERVICE: Record<string, Service> = {
  "Alys Taylor": "First home",
  "Brooke McHattie": "First home",
  "Tom Howden": "First home",
  "Genevieve Scanlan": "First home",
  "Jack Purtill": "First home",
  "Vicki Burton": "First home",
  "Naguib Hardie": "First home",
  "Jessica Dale": "First home",
  "Janae Paton": "Refinance",
  "Kate Tinta": "Refinance",
  "Michelle Dehlen": "Refinance",
  "Anthony Arthur": "Refinance",
  "Madison Else": "Investing",
  "Connor Mahoney": "Investing",
  "Britta Webb": "Investing",
  "Timothy Warren": "Bought & sold",
  "Jodie Warren": "Bought & sold",
  "Philip Kelly": "Bought & sold",
  "Micky Parker": "Home purchase",
  "Ye Lin": "Home purchase",
  "Nicola Todhunter": "Home purchase",
  "kara dunnage": "Bought & sold",
  "Michael O Sullivan": "Bought & sold",
  "hannah medley": "First home",
  "Tom Wolff": "Bought & sold",
  "Tyler Horton": "First home",
  "Rafael Castro": "First home",
  "Alison Brand": "Investing",
  "Hannah Erlandsson": "First home",
  "Rachel Cullen": "Refinance",
  "Tameeka Taylor": "First home",
  "Emily Luck": "First home",
  "Greta Nelles": "First home",
  "Megan Wilson": "First home",
  "Simon Chamberlain": "First home",
  "Lily May Johnston": "First home",
  "Heidi Zandazad": "First home",
  "Stuart Brown": "First home",
  "Prudence Krook": "First home",
  "Campbell Banks": "First home",
  "Christopher Tague": "First home",
  "Richard Johnson": "Refinance",
  "Chloe Nelson": "First home",
  "Lucas": "Refinance",
  "Alejandra Hurtado": "Refinance",
  "Jo-Anne Boulton": "First home",
  "Josh": "Refinance",
  "Josh McKinnon": "First home",
  "John Macmahon": "First home",
  "Olivia Reynoldson": "First home",
  "Hayley": "Home purchase",
  "Madeline Duck": "Home purchase",
  "Van Trinh": "Home purchase",
  "Jye": "Home purchase",
  "Ashlee Percival": "Home purchase",
  "Kayla Jackson": "Home purchase",
};

const PRAISE: Record<string, Praise[]> = {
  "Alys Taylor": ["Communication"],
  "Micky Parker": ["Communication"],
  "James Roberts": ["Knew their stuff"],
  "Janae Paton": ["Communication", "Made it simple"],
  "Brooke McHattie": ["Communication", "Made it simple"],
  "Sarah Wilson": ["Communication", "Knew their stuff"],
  "Kate Tinta": ["Made it simple"],
  "Michelle Dehlen": ["Better rate"],
  "Ye Lin": ["Communication"],
  "Nicola Todhunter": ["Communication", "Made it simple"],
  "Zane Ratcliff": ["Communication", "Made it simple"],
  "Tom Howden": ["Knew their stuff"],
  "Genevieve Scanlan": ["Communication"],
  "Jack Purtill": ["Made it simple"],
  "Madison Else": ["Made it simple"],
  "Connor Mahoney": ["Made it simple"],
  "Timothy Warren": ["Communication"],
  "Jodie Warren": ["Communication", "Knew their stuff"],
  "Britta Webb": ["Communication"],
  "Vicki Burton": ["Communication"],
  "Naguib Hardie": ["Made it simple"],
  "Anthony Arthur": ["Made it simple", "Better rate"],
  "Philip Kelly": ["Made it simple"],
  "Jessica Dale": ["Better rate"],
  "kara dunnage": ["Communication"],
  "Michael O Sullivan": ["Communication"],
  "hannah medley": ["Communication", "Made it simple"],
  "Tom Wolff": ["Communication", "Made it simple"],
  "Tyler Horton": ["Communication", "Made it simple"],
  "Ellen Crump": ["Communication", "Made it simple"],
  "Lindie Verster": ["Communication", "Knew their stuff"],
  "Rachel Kendrick": ["Communication", "Made it simple"],
  "Rafael Castro": ["Knew their stuff"],
  "Danika Sayce": ["Made it simple"],
  "Michael White": ["Communication", "Made it simple", "Knew their stuff"],
  "Alison Brand": ["Made it simple", "Knew their stuff"],
  "Hannah Erlandsson": ["Knew their stuff"],
  "Rachel Cullen": ["Communication"],
  "Nicholas Bryant": ["Communication", "Knew their stuff"],
  "Thomas Bidstrup": ["Communication"],
  "Tameeka Taylor": ["Made it simple"],
  "Hayley": ["Communication", "Knew their stuff"],
  "Madeline Duck": ["Communication", "Made it simple"],
  "Emily Luck": ["Made it simple"],
  "Hamish MacDonald": ["Communication", "Made it simple"],
  "Sarah Sheppard": ["Communication", "Made it simple"],
  "Greta Nelles": ["Communication", "Made it simple"],
  "Sydney Fleming": ["Communication"],
  "Dana Qureshi": ["Made it simple"],
  "Ilse Surridge": ["Communication", "Knew their stuff"],
  "Megan Wilson": ["Knew their stuff"],
  "Simon Chamberlain": ["Communication"],
  "Van Trinh": ["Communication", "Knew their stuff"],
  "Lizalet Oosthuizen": ["Communication", "Made it simple"],
  "Lily May Johnston": ["Knew their stuff"],
  "Jacob Bradford": ["Knew their stuff"],
  "Heidi Zandazad": ["Made it simple"],
  "David Laurie": ["Knew their stuff"],
  "Kaija Salier": ["Communication", "Knew their stuff"],
  "Andrew Waddell": ["Made it simple"],
  "Luke Chaplain": ["Knew their stuff"],
  "C B": ["Made it simple"],
  "Peter Ogden": ["Communication"],
  "Fiona Doherty": ["Knew their stuff"],
  "Stuart Brown": ["Made it simple"],
  "mark allen": ["Knew their stuff"],
  "Robyn": ["Knew their stuff"],
  "Luke Gilly": ["Communication", "Better rate"],
  "Nat Green": ["Made it simple"],
  "Adriana Alvavarenga": ["Knew their stuff"],
  "Rhonda Burton": ["Made it simple"],
  "Andrew Judd": ["Knew their stuff"],
  "Chris Denhez": ["Communication"],
  "Jye": ["Communication", "Made it simple"],
  "Catherine Curran": ["Knew their stuff"],
  "Sinead Curran": ["Communication"],
  "Amanda Fowler": ["Communication"],
  "Wendy Clark": ["Made it simple"],
  "Lawrence O’Neill": ["Made it simple"],
  "Deirdre Cosgrave": ["Better rate"],
  "Harriett Guy": ["Communication"],
  "LOUISE MCQUILLAN": ["Knew their stuff"],
  "Mish Hinde": ["Made it simple"],
  "Daniel Allen": ["Knew their stuff"],
  "Jules": ["Made it simple"],
  "Prudence Krook": ["Knew their stuff"],
  "Campbell Banks": ["Knew their stuff"],
  "Chloe Mander": ["Knew their stuff", "Better rate"],
  "John Forwood": ["Knew their stuff"],
  "Jarvis Archer": ["Knew their stuff"],
  "Christopher Tague": ["Made it simple", "Better rate"],
  "Richard Johnson": ["Communication", "Made it simple"],
  "Clodagh Creighton": ["Communication"],
  "Chloe Nelson": ["Knew their stuff"],
  "Lucas": ["Communication"],
  "Colin Farrelly": ["Made it simple"],
  "Ashlee Percival": ["Knew their stuff"],
  "Stephanie Albert": ["Made it simple"],
  "adrian heighway": ["Knew their stuff"],
  "Isobel Brigden": ["Communication"],
  "Michael Stower": ["Made it simple"],
  "Pat Marc": ["Made it simple", "Knew their stuff"],
  "Arieta Park": ["Communication"],
  "Alejandra Hurtado": ["Made it simple"],
  "Kevin Mayorga": ["Knew their stuff"],
  "Neil Loo": ["Communication", "Made it simple"],
  "Julian BSR": ["Communication"],
  "Jo-Anne Boulton": ["Knew their stuff"],
  "Jacob Krusche": ["Communication"],
  "Michael Mal": ["Made it simple"],
  "Roberto Alvarenga": ["Knew their stuff"],
  "Serene Duff": ["Knew their stuff"],
  "Naes": ["Knew their stuff"],
  "Josh": ["Communication"],
  "Kayla Jackson": ["Communication"],
  "Amy Johnston": ["Made it simple"],
  "Josh McKinnon": ["Knew their stuff"],
  "John Macmahon": ["Made it simple"],
  "Olivia Reynoldson": ["Communication"],
};

// The brokers by first name, matched against the review text. Only names that
// actually appear are tagged, so a broker chip's count is a fact about the
// words, not an attribution we made up.
export const BROKERS = ["Hugh", "Callum", "Jacob"] as const;
export type Broker = (typeof BROKERS)[number];

export const brokersIn = (text: string): Broker[] =>
  BROKERS.filter((b) => new RegExp(`\\b${b}\\b`, "i").test(text));

export const ALL_REVIEWS: Review[] = REVIEWS.map((r) => ({
  ...r,
  service: SERVICE[r.name],
  praise: PRAISE[r.name] ?? [],
}));

// Build-time guard: a review that carries no tag at all is unreachable by
// every filter on the page, which is the bug this file exists to prevent.
const ORPHANS = ALL_REVIEWS.filter((r) => !r.service && r.praise.length === 0);
if (ORPHANS.length > 0) {
  throw new Error(
    `Reviews with no service and no praise tag (unreachable by any filter): ${ORPHANS.map((r) => r.name).join(", ")}`
  );
}

export const SERVICES: Service[] = [
  "First home",
  "Home purchase",
  "Refinance",
  "Investing",
  "Bought & sold",
];

export const PRAISES: Praise[] = ["Communication", "Made it simple", "Knew their stuff", "Better rate"];

export const countService = (s: Service) => ALL_REVIEWS.filter((r) => r.service === s).length;
export const countPraise = (p: Praise) => ALL_REVIEWS.filter((r) => r.praise.includes(p)).length;

// Topic-matched reviews for the loan pages: the proof sits next to the claim
// rather than only on /reviews.
export const reviewsFor = (service: Service, limit = 3): Review[] =>
  ALL_REVIEWS.filter((r) => r.service === service).slice(0, limit);

// The page's default view is every review, grouped under the thing the client
// came in for, so you can read the lot section by section without clicking a
// filter and hiding the rest. The last group catches the reviews that name no
// transaction: they are about the people rather than the job, and they are
// still someone's words, so they get a heading of their own instead of being
// quietly dropped.
export type Group = {
  key: string;
  heading: string;
  blurb: string;
  service?: Service;
  reviews: Review[];
};

const BLURBS: Record<Service, string> = {
  "First home": "First home buyers, who ask the most questions and deserve the most patience.",
  "Home purchase": "Buying a home, not their first, where the pressure is usually the settlement date.",
  Refinance: "Refinances and repricings, including the ones where we never changed lenders.",
  Investing: "Investors adding a property, where the structure matters as much as the rate.",
  "Bought & sold": "Selling one and buying another, both ends running at once.",
};

export const GROUPS: Group[] = [
  ...SERVICES.map((s) => ({
    key: s,
    heading: s,
    blurb: BLURBS[s],
    service: s,
    reviews: ALL_REVIEWS.filter((r) => r.service === s),
  })),
  {
    key: "team",
    heading: "Working with the team",
    blurb: "Reviews that talk about the people rather than the transaction.",
    reviews: ALL_REVIEWS.filter((r) => !r.service),
  },
].filter((g) => g.reviews.length > 0);

// Grouping must be a partition: every review in exactly one group, none lost.
const GROUPED = GROUPS.reduce((n, g) => n + g.reviews.length, 0);
if (GROUPED !== ALL_REVIEWS.length) {
  throw new Error(
    `Review groups cover ${GROUPED} of ${ALL_REVIEWS.length} reviews. Every review must sit in exactly one group.`
  );
}
