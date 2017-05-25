


class CurrentEventApi {

    static fetchCurrentEvent(key) {
    //var url ="http://www.georgiancollege.ca/news-events/events/categories/important-dates/" + key + "/feed";
    var items
  if (key== 121) {
      
        items = [
          { 
              'date': '2017/09/09',
              'description': 'nation day'
          },

          { 
              'date': '2017/09/09',
              'description': '222'  
          },
          { 
              'date': '2017/09/09',
              'description': 'bbbb'   
          },
          { 
              'date': '2015/09/09',
              'description': 'AAA-051'
          }]
    } else {
        items = [
          { 
              'date': '2015/09/09',
              'description': 'AAA-051'
          },

          { 
              'date': '2015/09/09',
              'description': 'AAA-601'  
          },
          { 
              'date': '2015/09/09',
              'description': 'AAA-901'   
          },
          { 
              'date': '2015/09/09',
              'description': 'BBB-001'
          },

          { 
              'date': '2015/09/09',
              'description': 'BBB-002'  
          },
          { 
              'date': '2015/09/09',
              'description': 'BBB-003'   
          }]
    }
     return items
   }
}

export default CurrentEventApi