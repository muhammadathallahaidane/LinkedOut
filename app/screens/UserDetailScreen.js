import { gql, useQuery } from "@apollo/client"

const GET_USER_DETAILS = gql`
        query GetUser($getUserId: ID) {
    getUser(id: $getUserId) {
        _id
        email
        name
        username
        followers {
        _id
        email
        name
        username
        }
        followings {
        _id
        email
        name
        username
        }
    }
    }
`
export default function UserDetailScreen({route}) {
    const { id, name } = route.params
    const {loading, data, error} = useQuery(GET_USER_DETAILS, {
        variables: {
            getUserId: id
            // id didapat ketika dari button/pressable yang mengarah ke screen ini harus mengirim user id
        }
    })

      if (loading) return <View><Text>loading...</Text></View>
      if (error) return <View><Text>error...</Text></View>

    return (
    <View style={styles.container}>
      <Text>UserDetailScreen</Text>
      <Text style={{ fontSize: 30 }}>Data: {JSON.stringify(data, null, 2)}</Text>
    </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "fff",
    justifyContent: "center",
    alignItems: "center"
  }
})