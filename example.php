<!DOCTYPE html>
<html>
    <head>
        <title>JClock example</title>
        <script src="https://raw.github.com/DmitryBaranovskiy/raphael/master/raphael-min.js"></script>        
        <script src="./jclock.js"></script>
    </head>
    <body>
        <div id="canvas"></div>
        <input type="button" value="Move" onClick="cl.setTime(6, 15, 5000);" />
        <script>
            var paper = Raphael("canvas", 400, 400),
                cl = clock(paper, 200, 200, 150);
        </script>
    </body>
</html>
