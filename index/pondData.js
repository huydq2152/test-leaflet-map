var pond1 = [
   [11.338742079290764, 108.89905918790635],
   [11.338166628796698, 108.89967799004427],
   [11.338961000370086, 108.90054558891804],
   [11.339642782085296, 108.89990126916618],
   [11.33901103945037, 108.89918039657253]
];
var pond2 = [
   [11.338131036995229, 108.89965947192566],
   [11.337390729575826, 108.90037830389612],
   [11.338219137395168, 108.90128354938089],
   [11.338955497886202, 108.90056605852236]
]

function ConvertCoordinates(originalCoordinates) {
   var res = [];
   for (var i = 0; i < originalCoordinates.length; i++) {
      var coord = originalCoordinates[i];
      // Chuyển đổi thứ tự kinh độ và vĩ độ
      var newCoord = [coord[1], coord[0]];
      res.push(newCoord);
   }
   return res;
}

var pondDatas = {
   "type": "FeatureCollection",
   "features": [
      {
         "type": "Feature",
         "properties": {
            "id": 1,
            "code": "Đ1",
            "name": "Đầm 1",
            "status": 1,
            "fromPondId": 2
         },
         "geometry": {
            "type": "Polygon",
            "coordinates": [
               ConvertCoordinates(pond1)
            ]
         }
      },
      {
         "type": "Feature",
         "properties": {
            "id": 2,
            "code": "Đ2",
            "name": "Đầm 2",
            "status": 2,
            "fromPondId": null
         },
         "geometry": {
            "type": "Polygon",
            "coordinates": [
               ConvertCoordinates(pond2)
            ]
         }
      }
   ]
};