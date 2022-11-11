import { Card, Grid, Text } from "@nextui-org/react";
import { User } from "../../types/user";

interface Props {
  users: User[];
  me: User | null;
  dominantUser: User | null;
}

const UI = ({ users, me, dominantUser }: Props) => {
  return (
    <div>
      <p style={{ textAlign: "center" }}>
        Me: {me?.id}
        <br />
        Dominant Speaker:{" "}
        {dominantUser ? (
          <span>
            {dominantUser.id}({dominantUser.score})
          </span>
        ) : (
          "None"
        )}
      </p>
      <Grid.Container gap={2} justify="center">
        {users.map((user) => (
          <Grid sm={6} xs={12} key={user.id}>
            <Card
              css={{
                h: "$20",
                $$cardColor:
                  user.id === dominantUser?.id
                    ? "$colors$success"
                    : user.id === me?.id
                    ? "$colors$gradient"
                    : "$colors$primary",
              }}
            >
              <Card.Body>
                <Text h6 size={15} color="white" css={{ m: 0 }}>
                  {`${user.id}: ${user.score}`}
                </Text>
              </Card.Body>
            </Card>
          </Grid>
        ))}
      </Grid.Container>
    </div>
  );
};
export default UI;
