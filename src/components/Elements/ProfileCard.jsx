import React from "react";
import { days } from "./Calendar";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
  Button,
} from "@nextui-org/react";

export default function ProfileCard({ profile }) {
  const [isFollowed, setIsFollowed] = React.useState(false);

  return (
    <Card className="w-full mb-4">
      <CardHeader className="justify-between">
        <div className="flex gap-5">
          <Avatar
            isBordered
            radius="full"
            size="md"
            // src={`https://avatar.iran.liara.run/public/girl?username=${profile.name}`}
            src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${profile.name}&scale=120&skinColor=f2d3b1,ecad80&mouth=variant01,variant23,variant27,variant16`}
          />
          <div className="flex flex-col gap-1 items-start justify-center">
            <h4 className="text-small font-semibold leading-none text-default-600">
              {profile.name}
            </h4>
            <h5 className="text-small tracking-tight text-default-400">
              @{profile.name}
            </h5>
          </div>
        </div>
        {/* <Button
          className={isFollowed ? "bg-transparent text-foreground border-default-200" : ""}
          color="primary"
          radius="full"
          size="sm"
          variant={isFollowed ? "bordered" : "solid"}
          onPress={() => setIsFollowed(!isFollowed)}
        >
          {isFollowed ? "Unfollow" : "Follow"}
        </Button> */}
      </CardHeader>
      <CardBody className="px-3 py-0 text-small text-default-400">
        <p>{profile.intro}</p>
      </CardBody>
      <CardFooter className="gap-3">
        {/* <div className="flex gap-1">
          <p className="font-semibold text-default-400 text-small">Availibility</p>
          <p className=" text-default-400 text-small">{}</p>
        </div> */}
        {/* <div className="flex gap-1">
          <p className="font-semibold text-default-400 text-small">97.1K</p>
          <p className="text-default-400 text-small">Followers</p>
        </div> */}
        <div className="flex gap-1 items-center">
          <p className="font-semibold text-default-400 text-small">
            Availibilities:{" "}
          </p>
          <div>
            <p className=" text-default-400 text-small">
              {profile.availibilities.map((a) => (
                <Button size="sm" variant="bordered" className="me-1" key={a}>
                  {days[a]}
                </Button>
              ))}
            </p>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
