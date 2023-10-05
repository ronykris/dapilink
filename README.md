## Inspiration


**1. Growing Concerns Over Online Privacy:**
The primary inspiration behind DSearch was the increasing concern over online privacy. In recent years, individuals have become acutely aware of how their online activities are subjected to relentless tracking and surveillance. This growing awareness has raised important questions about digital privacy and the need for more secure and private online experiences.

**2. The Illusion of Private Browsing:**
A significant issue that caught our attention was the common misconception surrounding private browsing modes offered by traditional search engines. Many users believe that by using "incognito" or "private" modes, their online activities remain shielded from prying eyes. However, empirical evidence suggests otherwise. While these modes might prevent your browsing history from being stored on your local device, they do little to protect you from the data collection practices of websites, search engines and external organizations like your ISP.

**3. The Dilemma of Data Collection:**
Websites, including search engines like Google, often employ sophisticated tracking mechanisms to collect user data without their explicit consent. This data can include search queries, visited websites, location information, and more. Such information is used for various purposes, including targeted advertising and user profiling. Users often find themselves in a dilemma, unknowingly surrendering their privacy for the convenience of online search and services.

## What it does
Here's what DSearch does:

1. **Privacy-Centric Search:** DSearch employs advanced encryption and privacy-preserving techniques to ensure user anonymity. When a user submits a search query, it is processed in a way that separates the user's identity from the query itself. This means that neither DSearch nor any external entity can trace the query back to the user. Additionally, DSearch doesn't store user search history or use tracking cookies, guaranteeing that user data remains private.

2. **Decentralized Infrastructure:** DSearch operates on a decentralized network of nodes, each hosting a copy of the search engine's index. This decentralized architecture enhances fault tolerance and resiliency. When a user submits a query, it is routed through this network, ensuring that there is no single point of failure or control.

3. **Anonymous Browsing:** DSearch not only prevents tracking by search engines but also protects users from website tracking mechanisms. By using the Oasis Privacy Layer, it acts as a privacy shield between the user and the websites they visit, blocking cookies, scripts, and trackers commonly employed by websites. This comprehensive approach ensures that user activity remains truly private during their online journeys.

For building DSearch, we constructed a very complicated infrastructure in the backend. We later realised that this infrastructure can be open-sourced and will be beneficial to a lot of people building on OPL. We called this protocol as API Link and DSearch serves as just one compelling use case within its ecosystem. API Link is a protocol that allows Oasis Sapphire users to securely invoke APIs to interact with the external world. By connecting on-chain events and data with the external world, we believe that this protocol will bridge the gap between the two worlds and open up a new domain of decentralized applications (dApps). Here's what API Link does:

1. **Secure API Invocation:** API Link provides a secure channel for dApps to interact with external APIs. It accomplishes this by employing encryption and authentication mechanisms, ensuring that data exchanged between the dApp and external services remains confidential and tamper-proof. Developers can specify access controls and permissions, granting or restricting access to specific APIs based on predefined criteria.

2. **Bridging On-Chain and Off-Chain Data:** API Link acts as a bridge that connects blockchain data with real-world data sources. It utilizes Oracle services to fetch real-time data from external sources and makes it available on the blockchain. This capability is crucial for dApps that rely on up-to-date real-world information.

3. **Enhanced dApp Possibilities:** Developers can leverage API Link to create dApps that were previously challenging to build within the confines of a closed blockchain ecosystem. For example, a financial dApp could use API Link to securely fetch stock prices or exchange rates from external financial data providers, ensuring accuracy and reliability.

4. **Augmenting the Oasis Network:** API Link enhances the overall value proposition of the Oasis Network by making it more versatile and attractive to developers. It extends the network's capabilities, making it an ideal choice for projects that require privacy, security, and seamless integration with real-world data sources.

## How we built it

## Challenges we ran into
Building DSearch was not an easy task. We encountered several challenges, but with the help of mentors & rigourous learning we landed our successful error-free project. Let's delve deep into the technical details of the challenges faced while building DSearch:

**1. Learning Curve with Sapphire and OPL:**
Our initial hurdle was the learning curve associated with Oasis Sapphire and the Oasis Privacy Layer (OPL). Both technologies were novel to our team, requiring us to invest time in comprehending their inner workings, architecture, and APIs. We needed a firm grasp of how to leverage Sapphire and OPL effectively to implement privacy features within DSearch.

**2. Complex Contract Code:**
The complexity of DSearch's smart contract code emerged as a formidable challenge. We integrated features such as a node manager responsible for handling network nodes and a password manager to enhance security. These additions, while valuable, introduced intricate logic and interactions within the contract code. Consequently, we encountered issues related to contract logic errors and intricacies that demanded meticulous debugging and optimization.

**3. Dockerization Hurdles:**
Dockerizing the nodes within DSearch posed technical difficulties. This process involved the integration of our custom network nodes with IPFS, a decentralized storage system. Challenges included network configuration, data synchronization between nodes and IPFS, and resource allocation. Overcoming these hurdles required expertise in containerization, networking, and distributed file systems.

**4. Navigating Next.js Changes:**
Our team faced challenges when working with Next.js, primarily due to significant updates in the framework. These updates introduced modifications in syntax, component structure, and build processes that differed from our prior experience. Consequently, we needed to dedicate substantial time to reacquainting ourselves with these changes and adjusting our development practices accordingly.


## Accomplishments that we're proud of
Here are the accomplishments we're proud of in the development of DSearch:

1. **Onsetting a Privacy Revolution**: Our most significant accomplishment is the creation of DSearch itself—a secure, decentralized, and distributed search engine that fundamentally redefines online privacy. We're proud to have developed a solution that empowers users to search the internet without sacrificing their privacy. DSearch represents a step forward in the ongoing battle to protect users from pervasive online surveillance.

2. **Building the API Link Protocol**: The development of the API Link protocol is a major achievement. By recognizing the broader potential of our backend infrastructure, we open-sourced API Link, benefiting not only our project but also the wider Oasis Privacy Layer (OPL) community. This protocol facilitates secure API invocation and paves the way for the creation of a new domain of decentralized applications (dApps) that can interact seamlessly with the external world.

3. **Complex Contract Implementation**: While challenging, successfully implementing complex contract logic within DSearch is a source of pride. The inclusion of features like the node manager and password manager enhances user security and functionality. We've demonstrated our ability to navigate intricate smart contract development, making DSearch a technically robust project.

4. **Integration with IPFS**: Overcoming the dockerization hurdles and integrating our network nodes with IPFS represents a significant technical achievement. This integration ensures that DSearch can securely and efficiently store and retrieve data while maintaining decentralization—a crucial aspect of our project.

## What we learned

1. **In-Depth Understanding of Oasis Technologies**: Building DSearch required a deep dive into Oasis technologies such as Oasis Sapphire and the Oasis Privacy Layer (OPL). We gained comprehensive knowledge of these technologies, enabling us to harness their power to create a privacy-focused search engine and the API Link protocol. This experience provided valuable insights into the Oasis ecosystem.

2. **Adaptability to Tech Changes**: Navigating changes in the Next.js framework taught us the value of adaptability. We learned to stay updated with evolving technologies and to quickly adapt to changes in frameworks, ensuring we maintain productivity and deliver polished user interfaces.

3. **Team Resilience and Collaboration**: Throughout the project, we honed our teamwork, communication, and problem-solving skills. We learned to tackle complex challenges collectively, leveraging the strengths of each team member to overcome obstacles and achieve our goals.

## What's next for DSearch

1. **Enhancing Computation Speed for Faster Results:**
   One of our primary objectives for the future of DSearch is to optimize computation speed. We aim to significantly reduce the time it takes to generate search results. This improvement will enhance the user experience by providing quicker access to information, aligning DSearch with the speed expectations of modern search engines. Achieving faster results will involve optimizing the underlying algorithms and infrastructure, ensuring that users can obtain the information they seek with minimal delay.

2. **Scaling Infrastructure for Greater Accessibility:**
  To accommodate a growing user base and increased demand, our next focus is to make the API Link infrastructure more scalable. We plan to expand the network of decentralized nodes that power DSearch, ensuring that the search engine can handle a higher volume of queries and maintain responsiveness even during peak usage. Scalability enhancements will be essential to support DSearch's continued growth and accessibility for users worldwide.
