<TeXmacs|2.1.1>

<style|generic>

<\body>
  <\eqnarray*>
    <tformat|<table|<row|<cell|fract<around*|(|M|)>>|<cell|=>|<cell|M-<around*|\<lfloor\>|M|\<rfloor\>>>>|<row|<cell|mix<around*|(|M,N,a|)>>|<cell|=>|<cell|<around*|(|1-a|)>\<cdot\>M+a\<cdot\>N>>|<row|<cell|clamp<around*|(|M,a,b|)>>|<cell|=>|<cell|min<around*|(|max<around*|(|M,a|)>,b|)>>>>>
  </eqnarray*>

  \;

  <\eqnarray*>
    <tformat|<table|<row|<cell|HSV>|<cell|=>|<cell|<around*|[|<tabular*|<tformat|<table|<row|<cell|hue>>|<row|<cell|saturation>>|<row|<cell|value>>>>>|]>=<around*|[|<tabular*|<tformat|<table|<row|<cell|h>>|<row|<cell|s>>|<row|<cell|v>>>>>|]>>>|<row|<cell|K>|<cell|=>|<cell|<around*|[|<stack|<tformat|<table|<row|<cell|1>>|<row|<cell|<frac*|2|3>>>|<row|<cell|<frac*|1|3>>>|<row|<cell|3>>>>>|]>>>|<row|<cell|P>|<cell|=>|<cell|<around*|\||6\<cdot\>fract<around*|(|HSV<rsub|h
    h h>+K<rsub|x y z>|)>-K<rsub|w w w>|\|>>>|<row|<cell|RGB>|<cell|=>|<cell|HSV<rsub|v>\<cdot\>mix<around*|(|K<rsub|x
    x x>,clamp<around*|(|P-K<rsub|x x x>,0,1|)>,HSV<rsub|s>|)>>>>>
  </eqnarray*>

  \;

  <\eqnarray*>
    <tformat|<table|<row|<cell|r<around*|(|h,s,v|)>>|<cell|=>|<cell|v\<cdot\>mix<around*|(|1,clamp<around*|(|<around*|\||6\<cdot\>fract<around*|(|h+1|)>-3|\|>-1,0,1|)>,s|)>>>|<row|<cell|g<around*|(|h,s,v|)>>|<cell|=>|<cell|v\<cdot\>mix<around*|(|1,clamp<around*|(|<around*|\||6\<cdot\>fract<around*|(|h+<frac*|2|3>|)>-3|\|>-1,0,1|)>,s|)>>>|<row|<cell|b<around*|(|h,s,v|)>>|<cell|=>|<cell|v\<cdot\>mix<around*|(|1,clamp<around*|(|<around*|\||6\<cdot\>fract<around*|(|h+<frac*|1|3>|)>-3|\|>-1,0,1|)>,s|)>>>>>
  </eqnarray*>
</body>

<\initial>
  <\collection>
    <associate|page-height|auto>
    <associate|page-medium|paper>
    <associate|page-type|letter>
    <associate|page-width|auto>
  </collection>
</initial>