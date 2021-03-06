import StatefulButton from '../StatefulButton.js'

export default class Name extends React.Component {

  render() {
    let { value, setName } = this.props

    return (
      <div>
        <h5>Public name</h5>

        <form className='form-inline'>

          <div className='form-group'>
            <label htmlFor='Name-input'>Name</label>{' '}
            <input
              type='text'
              className='form-control'
              id='Name-input'
              placeholder='Jane Doe'
              ref='name'
              defaultValue={value}
              />
          </div>{' '}

          <StatefulButton
            type='submit'
            className='btn btn-primary'
            onClick={async () => {
              await setName(this.refs.name.value)
            }}
            >Save</StatefulButton>

        </form>
      </div>
    )
  }

}
