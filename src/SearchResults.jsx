import { ListGroup } from "react-bootstrap";

export function SearchResults(props) {
  let results = props.results;

  if (results && results.length > 0) {
    return (
      <div className='movie-search-results'>
        <ListGroup>
          {
            results.map(res => {
              return (
             <ListGroup.Item key={res.id} className='row' onClick={() => {props.submit(res); console.log('submit!')} }>{res.title} ({res.release_date.substring(0, 4)})</ListGroup.Item>
              )
            })
          }
        </ListGroup>
      </div>
    )
  }
}