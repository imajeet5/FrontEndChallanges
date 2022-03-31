# Working

So we have two observers:
1. List Observer: Jo ki at then end of the content hai. When it is near the viewport un-inserted content is add to the DOM
2. Sentinel observer is at  position absolute, 150vh above the bottom, here we will request the server for the new content. 

So Sentinel Observer jab hit karega tab hum request kare ke, just jab List observer hit karne vala hoga (we have take a margin of 200px) tab hu new content DOM me add kare ge.  

We have placed a sentinel element
Bottom ise 150vh uper rakha hai. 
