The `core` library only consists of the following functions:

 -  [pipe](#pipe)
 -  [pipe.async](#pipeasync)
 -  [accumulate](#accumulate)
 -  [chain](#chain)
 -  [connect](#connect)
 -  [flatten](#flatten)
 -  [merge](#merge)
 -  [zip](#zip)
 -  [split](#split)

**Set up code for examples**

```javascript

  // Setup
  let createReadable = data => new ReadableStream({
      start (controller) {
      this.data = data || [1,2,3];

      // Kickstart stream
      controller.enqueue( this.data.pop() );
      },
      pull (controller) {
      if ( !this.data.length )
          return controller.close()

      controller.enqueue( this.data.pop() );
      }
  }),
  createWritable = () => new WritableStream({
      write (chunk) {
      console.log( chunk );
      }
  });
```
